import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown, Filter } from "lucide-react";

import StatsCards from "../component/history/StatsCards";
import SearchBar from "../component/history/SearchBar";
import TransactionFilters from "../component/history/TransactionFilters";
import TransactionList from "../component/history/TransactionList";

export default function History() {
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [range, setRange] = useState("Today");

  const [sortFilter, setSortFilter] = useState("Latest First");

  const [showDropdown, setShowDropdown] = useState(false);

  // API DATA

  const [transactionsData, setTransactionsData] = useState([]);

  const [loading, setLoading] = useState(true);

  // INFINITE SCROLL

  const [visibleCount, setVisibleCount] = useState(20);

  const loadMoreRef = useRef(null);

  // RESET VISIBLE ITEMS

  useEffect(() => {
    setVisibleCount(20);
  }, [sortFilter, filter, search, range]);

  // FETCH TRANSACTIONS

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      // SALES

      const salesResponse = await fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const salesData = await salesResponse.json();

      // RESTOCKS

      const restockResponse = await fetch(`${process.env.REACT_APP_API_URL}/stock-movements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const restockData = await restockResponse.json();

      if (!salesResponse.ok) {
        throw new Error(salesData.detail);
      }

      if (!restockResponse.ok) {
        throw new Error(restockData.detail);
      }

      // FORMAT SALES

      const formattedSales = salesData.map((transaction) => {
        const date = new Date(transaction.created_at);

        return {
          id: transaction.id,

          type: "sale",

          created_at: transaction.created_at,

          date: date.toLocaleDateString("en-US", {
            weekday: "long",

            month: "long",

            day: "numeric",
          }),

          time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",

            minute: "2-digit",
          }),

          payment_method: transaction.payment_method?.trim(),

          total: transaction.total_amount,

          items_count: transaction.items.length,

          items: transaction.items.map((item) => ({
            name: item.product_name,

            qty: item.quantity,

            price: item.subtotal,
          })),
        };
      });

      // FORMAT RESTOCKS

      const formattedRestocks = restockData.map((movement) => {
        const date = new Date(movement.created_at);

        return {
          id: movement.id,

          type: movement.type === "ADJUSTMENT" ? "adjustment" : "restock",

          created_at: movement.created_at,

          date: date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),

          time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),

          product_name: movement.product_name,

          quantity: movement.change_quantity,

          previous_stock: movement.previous_stock,

          new_stock: movement.new_stock,
        };
      });

      // MERGE

      setTransactionsData([...formattedRestocks, ...formattedSales]);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // FILTER + SEARCH + RANGE

  const filteredTransactions = useMemo(() => {
    let filtered = transactionsData.filter((transaction) => {
      // FILTERS

      let filterMatch = true;

      if (filter === "Sales") {
        filterMatch = transaction.type === "sale";
      } else if (filter === "Restocks") {
        filterMatch = transaction.type === "restock";
      } else if (filter === "Adjustments") {
        filterMatch = transaction.type === "adjustment";
      } else if (filter !== "All") {
        filterMatch = transaction.payment_method?.toLowerCase()?.trim() === filter?.toLowerCase()?.trim();
      }

      // SEARCH

      const searchLower = search.toLowerCase();

      const searchMatch =
        transaction.type === "restock" || transaction.type === "adjustment"
          ? transaction.product_name?.toLowerCase().includes(searchLower)
          : transaction.payment_method?.toLowerCase().includes(searchLower) ||
            (transaction.total || 0).toString().includes(search) ||
            transaction.items.some((item) => item.name.toLowerCase().includes(searchLower));

      // RANGE FILTER

      const now = new Date();

      const transactionDate = new Date(transaction.created_at);

      let rangeMatch = true;

      if (range === "Today") {
        rangeMatch = transactionDate.toDateString() === now.toDateString();
      }

      if (range === "Week") {
        const diff = (now - transactionDate) / (1000 * 60 * 60 * 24);

        rangeMatch = diff <= 7;
      }

      if (range === "Month") {
        rangeMatch = transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
      }
      if (range === "Custom" && customRange.start && customRange.end) {
        const start = new Date(customRange.start);

        const end = new Date(customRange.end);

        end.setHours(23, 59, 59, 999);

        rangeMatch = transactionDate >= start && transactionDate <= end;
      }

      return filterMatch && searchMatch && rangeMatch;
    });

    filtered = [...filtered];

    // SORTING

    if (sortFilter === "Highest Amount") {
      filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    }

    if (sortFilter === "Lowest Amount") {
      filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
    }

    if (sortFilter === "Latest First") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (sortFilter === "Oldest First") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return filtered;
  }, [transactionsData, search, filter, sortFilter, range, customRange.start, customRange.end]);

  // VISIBLE ITEMS

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  // GROUP BY DATE

  const groupedTransactions = visibleTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = [];
    }

    acc[transaction.date].push(transaction);

    return acc;
  }, {});

  // FILTER OPTIONS

  const filterOptions = ["Latest First", "Oldest First", "Highest Amount", "Lowest Amount"];

  // INFINITE SCROLL

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredTransactions.length) {
          setVisibleCount((prev) => prev + 5);
        }
      },
      {
        threshold: 1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredTransactions.length]);

  // LOADING

  if (loading) {
    return (
      <div
        className="
          py-10
          text-center
          text-gray-400
          dark:text-slate-500
        "
      >
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HERO */}

      <div
        className="
          relative
          isolate
          overflow-hidden

          rounded-[30px]

          border
          border-[#eef2f7]
          dark:border-[#1F2937]

         bg-gradient-to-br
      from-[#fffaf3]
      to-[#fff7ed]

      dark:from-[#111827]
      dark:to-[#0F172A]

          px-7
          py-6

          shadow-sm

          transition-all
          duration-300
        "
      >
        <div
          className="
            absolute
            top-0
            right-0

            h-[180px]
            w-[180px]

            rounded-full

            bg-orange-100/10
            dark:bg-orange-500/10

            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10

            flex
            items-center
            justify-between
          "
        >
          {/* LEFT */}

          <div>
            <h1
              className="
                text-[38px]
                font-black
                leading-[0.95]

                text-[#071437]
                dark:text-white
              "
            >
              Store Activity
            </h1>

            <p
              className="
                mt-3
                text-[14px]

                text-gray-600
                dark:text-slate-400
              "
            >
              Track sales, restocks, adjustments, and payment activity in one place.
            </p>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center

              rounded-[24px]

              border
              border-orange-100/80
              dark:border-orange-500/20

              bg-[#fff7ed]
              dark:bg-[#111827]
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-[18px]

                border
                border-orange-100
                dark:border-orange-500/10

                bg-white
                dark:bg-[#0F172A]

                text-[24px]
              "
            >
              🧾
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* FILTER BUTTON */}

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="
              flex
              items-center
              gap-2

              rounded-[18px]

              border
              border-gray-200
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#111827]

              px-5
              py-3

              text-[15px]
              font-semibold

              text-[#172033]
              dark:text-white

              shadow-sm

              transition

              hover:bg-gray-50
              dark:hover:bg-[#1E293B]
            "
          >
            <Filter size={18} />
            Filter
            <ChevronDown size={16} />
          </button>

          {/* DROPDOWN */}

          {showDropdown && (
            <div
              className="
                absolute
                right-0
                top-[110%]
                z-50

                w-52

                rounded-2xl

                border
                border-gray-100
                dark:border-[#1F2937]

                bg-white
                dark:bg-[#111827]

                p-2

                shadow-xl
              "
            >
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortFilter(option);

                    setShowDropdown(false);
                  }}
                  className={`
                    w-full

                    rounded-xl

                    px-4
                    py-3

                    text-left
                    text-sm

                    transition

                    ${
                      sortFilter === option
                        ? `
                          bg-orange-50
                          dark:bg-orange-500/10

                          font-semibold

                          text-orange-500
                        `
                        : `
                          text-gray-700
                          dark:text-slate-300

                          hover:bg-gray-50
                          dark:hover:bg-[#1E293B]
                        `
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FILTERS */}

      <TransactionFilters
        filter={filter}
        setFilter={setFilter}
        range={range}
        setRange={setRange}
        customRange={customRange}
        setCustomRange={setCustomRange}
      />

      {/* STATS */}

      <StatsCards
        totalSales={filteredTransactions
          .filter((transaction) => transaction.type === "sale")
          .reduce((sum, transaction) => sum + Number(transaction.total || 0), 0)}
        totalTransactions={filteredTransactions.filter((transaction) => transaction.type === "sale").length}
        totalRestocks={
          filteredTransactions.filter((transaction) => transaction.type === "restock" || transaction.type === "adjustment").length
        }
      />

      {/* LIST */}

      <TransactionList groupedTransactions={groupedTransactions} />

      {/* LOADER */}

      {visibleTransactions.length < filteredTransactions.length && (
        <div
          ref={loadMoreRef}
          className="
            flex
            items-center
            justify-center

            py-10
          "
        >
          <div
            className="
              flex
              items-center
              gap-3

              rounded-full

              border
              border-gray-100
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#111827]

              px-5
              py-3

              shadow-sm
            "
          >
            <div
              className="
                h-4
                w-4

                animate-spin

                rounded-full

                border-2
                border-orange-200
                border-t-orange-500
              "
            />

            <span
              className="
                text-[13px]
                font-medium

                text-gray-400
                dark:text-slate-400
              "
            >
              Loading more transactions
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
