import { useMemo, useEffect, useState } from "react";

import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

import SalesHeader from "../component/sales/SalesHeader";
import SalesSearchBar from "../component/sales/SalesSearchBar";
import CategoryTabs from "../component/sales/CategoryTabs";
import ProductCard from "../component/sales/ProductCard";
import CartSidebar from "../component/sales/CartSidebar";
import AddProductModal from "../component/inventory/AddProductModal";

import productService from "../services/productService";
import transactionService from "../services/transactionService";

export default function RecordSale() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedFilter, setSelectedFilter] = useState("All Products");

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(`cart_${user.id}`);

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [amountPaid, setAmountPaid] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [loading, setLoading] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.category))];

    return ["All", ...uniqueCategories];
  }, [products]);

  /* FETCH PRODUCTS */

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();

      console.log("FETCHED PRODUCTS:", data);

      const savedFavorites = JSON.parse(localStorage.getItem(`favorite_products_${user.id}`)) || [];

      const formattedProducts = data.map((product) => ({
        id: product.id,

        name: product.name,

        category: product.category,

        price: product.selling_price,

        stock: product.stock_quantity,

        favorite: savedFavorites.includes(String(product.id)),
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  /* SAVE CART */

  useEffect(() => {
    localStorage.setItem(
      `cart_${user.id}`,

      JSON.stringify(cart)
    );
  }, [cart]);

  /* ADD PRODUCT */

  /* ADD PRODUCT */

  const addProduct = async (newProduct) => {
    try {
      console.log("ADDING PRODUCT:", newProduct);

      await productService.createProduct({
        id: crypto.randomUUID(),

        name: newProduct.name,

        category: newProduct.category,

        unit: newProduct.unit,

        cost_price: Number(newProduct.cost_price),

        selling_price: Number(newProduct.selling_price),

        stock_quantity: Number(newProduct.stock_quantity),

        min_stock_level: Number(newProduct.min_stock_level),
      });

      await fetchProducts();

      setShowAddProduct(false);

      toast.success("Product added successfully");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.detail || "Failed to add product");
    }
  };

  /* FAVORITE */

  const toggleFavorite = (id) => {
    const stringId = String(id);

    const updatedProducts = products.map((product) =>
      String(product.id) === stringId
        ? {
            ...product,

            favorite: !product.favorite,
          }
        : product
    );

    setProducts(updatedProducts);

    const favorites = updatedProducts

      .filter((product) => product.favorite)

      .map((product) => String(product.id));

    localStorage.setItem(
      `favorite_products_${user.id}`,

      JSON.stringify(favorites)
    );
  };

  /* FILTERED PRODUCTS */

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (selectedFilter === "Low Stock") {
      filtered = filtered.filter((product) => product.stock <= 10);
    }

    if (selectedFilter === "Out of Stock") {
      filtered = filtered.filter((product) => product.stock === 0);
    }

    if (selectedFilter === "Favorites") {
      filtered = filtered.filter((product) => product.favorite);
    }

    if (selectedFilter === "High Price") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    filtered = [...filtered].sort((a, b) => b.favorite - a.favorite);

    return filtered;
  }, [products, search, selectedCategory, selectedFilter]);

  /* CART */

  const increaseQuantity = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing && existing.quantity >= product.stock) {
      alert("Not enough stock");

      return;
    }

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      if (product.stock <= 0) {
        toast.error("Out of stock");

        return;
      }

      setCart([
        ...cart,

        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const decreaseQuantity = (product) => {
    setCart(
      cart

        .map((item) => {
          if (item.id === product.id) {
            return {
              ...item,

              quantity: item.quantity - 1,
            };
          }

          return item;
        })

        .filter((item) => item.quantity > 0)
    );
  };

  /* TOTAL */

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,

    0
  );

  /* COMPLETE SALE */

  const handleCompleteSale = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty");

        return;
      }

      if (Number(amountPaid) < subtotal) {
        toast.error("Insufficient payment");

        return;
      }

      setLoading(true);

      const payload = {
        total_amount: subtotal,

        amount_paid: Number(amountPaid),

        payment_method: paymentMethod,

        items: cart.map((item) => ({
          product_id: item.id,

          quantity: item.quantity,
        })),
      };

      console.log("SALE PAYLOAD:", payload);

      const response = await transactionService.createTransaction(payload);

      console.log("TRANSACTION RESPONSE:", response);

      if (response.error) {
        alert(response.error);

        return;
      }

      toast.success(
        `Sale Completed Successfully!`,

        {
          duration: 4000,

          style: {
            borderRadius: "18px",
            background: "#fff",
            color: "#071437",
            fontWeight: "600",
            padding: "14px 16px",
          },
        }
      );

      /* CLEAR CART */

      setCart([]);

      localStorage.removeItem(`cart_${user.id}`);

      setAmountPaid("");

      /* REFRESH PRODUCTS */

      await fetchProducts();
    } catch (error) {
      console.log("FULL ERROR:", error);

      console.log("ERROR RESPONSE:", error.response);

      console.log("ERROR DATA:", error.response?.data);

      alert(error.response?.data?.detail || error.message || "Failed to complete sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[minmax(0,1fr)_360px]
          gap-5
          h-full
          overflow-hidden
        "
      >
        {/* LEFT */}

        <div
          className="
            min-w-0
            flex
            flex-col
            gap-5
            h-full
            overflow-hidden
          "
        >
          <SalesHeader />

          {/* PRODUCTS */}

          <div
            className="
              flex-1
              min-h-0
              flex
              flex-col
            "
          >
            {/* SEARCH */}

            <div
              className="
                sticky
                top-0
                z-20
                bg-[#f5f7fb]
                pb-3
              "
            >
              <SalesSearchBar search={search} setSearch={setSearch} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
            </div>

            {/* SCROLL */}

            <div
              className="
                relative
                flex-1
                min-h-0
              "
            >
              {/* BOTTOM FADE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-0
                  right-0
                  z-10
                  h-8
                  bg-gradient-to-t
                  from-[#f5f7fb]/80
                  to-transparent
                "
              />

              <div
                className="
                  h-full
                  overflow-y-auto
                  overflow-x-hidden
                  pr-1
                  pb-6
                "
              >
                {/* CATEGORY */}

                <div
                  className="
                    pb-4
                  "
                >
                  <CategoryTabs categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                </div>

                {/* GRID */}

                <div
                  className="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    xl:grid-cols-5
                    gap-4
                  "
                >
                  {/* ADD PRODUCT CARD */}

                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="
                      bg-white
                      border-2
                      border-dashed
                      border-orange-200
                      rounded-[22px]
                      p-4
                      h-[160px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-3
                      hover:border-orange-400
                      hover:bg-orange-50
                      transition-all
                      duration-300
                    "
                  >
                    <div
                      className="
                        w-14
                        h-14
                        rounded-full
                        border
                        border-orange-300
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FiPlus
                        className="
                          text-[24px]
                          text-orange-500
                        "
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-[15px]
                          font-black
                          text-[#071437]
                        "
                      >
                        Add Product
                      </p>

                      <p
                        className="
                          mt-1
                          text-[12px]
                          text-gray-400
                        "
                      >
                        Create inventory item
                      </p>
                    </div>
                  </button>

                  {/* PRODUCTS */}

                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={cart.find((item) => item.id === product.id)?.quantity || 0}
                      increaseQuantity={increaseQuantity}
                      decreaseQuantity={decreaseQuantity}
                      toggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            h-full
            overflow-hidden
          "
        >
          <CartSidebar
            cart={cart}
            subtotal={subtotal}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            loading={loading}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            onCompleteSale={handleCompleteSale}
            clearCart={() => {
              setCart([]);

              localStorage.removeItem(`cart_${user.id}`);
            }}
          />
        </div>
      </div>

      {/* MODAL */}

      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} refreshProducts={fetchProducts} />}
    </>
  );
}
