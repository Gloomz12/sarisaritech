import { useState, useEffect } from "react";

import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiRefreshCcw,
  FiClock,
  FiPieChart,
  FiCpu,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { BsShop } from "react-icons/bs";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [user, setUser] =
    useState(null);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {

    const loadUser = () => {

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {

        setUser(
          JSON.parse(storedUser)
        );
      }
    };

    loadUser();

    window.addEventListener(
      "userUpdated",
      loadUser
    );

    return () => {

      window.removeEventListener(
        "userUpdated",
        loadUser
      );
    };

  }, []);

  const menuItems = [

    {
      icon: <FiHome />,
      label: "Dashboard",
      path: "/dashboard",
    },

    {
      icon: <FiShoppingCart />,
      label: "Record Sale",
      path: "/record-sale",
    },

    {
      icon: <FiPackage />,
      label: "Inventory",
      path: "/inventory",
    },

    {
      icon: <FiRefreshCcw />,
      label: "Restock",
      path: "/restock",
    },

    {
      icon: <FiClock />,
      label: "History",
      path: "/history",
    },

    {
      icon: <FiPieChart />,
      label: "Statistics",
      path: "/statistics",
    },

    {
      icon: <FiCpu />,
      label: "AI Insight",
      path: "/ai-insight",
    },

    {
      icon: <FiSettings />,
      label: "Settings",
      path: "/settings",
    },

  ];

  /* LOGOUT */

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div
      className={`
        relative
        h-screen
        overflow-visible

        bg-white
        dark:bg-[#111827]

        border-r
        border-gray-100
        dark:border-[#1F2937]

        flex
        flex-col

        transition-all
        duration-300

        ${sidebarOpen
          ? "w-[235px]"
          : "w-[82px]"
        }
      `}
    >

      {/* TOGGLE */}

      <button
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        className="
          absolute
          -right-4
          top-8
          z-50

          w-9
          h-9

          rounded-full

          bg-white/90
          dark:bg-[#1F2937]

          backdrop-blur-md

          border
          border-gray-200
          dark:border-[#374151]

          shadow-lg

          flex
          items-center
          justify-center

          text-gray-700
          dark:text-gray-300

          hover:bg-orange-50
          dark:hover:bg-[#2A3647]

          hover:text-orange-500
          hover:scale-105

          transition-all
          duration-300
        "
      >

        {sidebarOpen
          ? <FiChevronLeft size={17} />
          : <FiChevronRight size={17} />
        }

      </button>

      {/* LOGO */}

      <div
        className="
          h-20

          border-b
          border-gray-100
          dark:border-[#1F2937]

          flex
          items-center

          px-5
          gap-3
        "
      >

        <img
          src="/images/icon.png"
          alt="logo"
          className="
            w-10
            h-10
            rounded-2xl
          "
        />

        {sidebarOpen && (

          <h1
            className="
              text-[18px]
              font-bold
              whitespace-nowrap
            "
          >

            <span className="text-orange-500">
              SariSari
            </span>

            <span
              className="
                text-gray-800
                dark:text-white
              "
            >
              Tech
            </span>

          </h1>

        )}

      </div>

      {/* PROFILE */}

      <div
        className="
          px-4
          py-4

          border-b
          border-gray-100
          dark:border-[#1F2937]
        "
      >

        <div
          className={`
            flex
            items-center

            ${sidebarOpen
              ? "gap-3"
              : "justify-center"
            }
          `}
        >

          <div
            className="
              w-12
              h-12

              rounded-full

              bg-orange-50
              dark:bg-orange-500/10

              border
              border-orange-100
              dark:border-orange-500/20

              flex
              items-center
              justify-center
            "
          >

            <BsShop
              className="
                text-[22px]
                text-orange-500
              "
            />

          </div>

          {sidebarOpen && (

            <div className="min-w-0">

              <h2
                className="
                  font-semibold
                  text-sm

                  text-gray-800
                  dark:text-white

                  truncate
                "
              >
                {user?.store_name || "Store"}
              </h2>

              <p
                className="
                  text-xs

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Store Owner
              </p>

            </div>

          )}

        </div>

      </div>

      {/* MENU */}

      <div
        className="
          flex-1
          overflow-hidden

          px-3
          py-3

          space-y-1
        "
      >

        {menuItems.map((item, index) => {

          const isActive =
            location.pathname === item.path;

          return (

            <button
              key={index}
              onClick={() =>
                navigate(item.path)
              }
              className={`
                w-full
                h-11

                rounded-2xl
                px-4

                flex
                items-center

                transition-all
                duration-300

                group
                border

                ${isActive
                  ? `
                    bg-[#fdf4ea]
                    dark:bg-orange-500/10

                    border-orange-100
                    dark:border-orange-500/20

                    shadow-sm
                  `
                  : `
                    border-transparent

                    hover:bg-orange-50
                    dark:hover:bg-[#1F2937]

                    hover:border-orange-100
                    dark:hover:border-[#374151]
                  `
                }
              `}
            >

              <div
                className={`
                  flex
                  items-center
                  w-full

                  ${sidebarOpen
                    ? "gap-3"
                    : "justify-center"
                  }
                `}
              >

                <div
                  className={`
                    text-[18px]

                    ${isActive
                      ? "text-orange-500"
                      : `
                        text-gray-500
                        dark:text-gray-400

                        group-hover:text-orange-500
                      `
                    }
                  `}
                >
                  {item.icon}
                </div>

                {sidebarOpen && (

                  <span
                    className={`
                      text-sm
                      font-medium
                      whitespace-nowrap

                      ${isActive
                        ? "text-orange-500"
                        : `
                          text-gray-700
                          dark:text-gray-300

                          group-hover:text-orange-500
                        `
                      }
                    `}
                  >
                    {item.label}
                  </span>

                )}

              </div>

            </button>

          );

        })}

      </div>

      {/* FOOTER */}

      <div
        className="
          p-3

          border-t
          border-gray-100
          dark:border-[#1F2937]
        "
      >

        <button
          onClick={handleLogout}
          className="
            w-full
            h-10

            rounded-2xl
            px-4

            flex
            items-center

            hover:bg-red-50
            dark:hover:bg-red-500/10

            transition-all
            duration-300

            text-red-500
            dark:text-red-400
          "
        >

          <div
            className={`
              flex
              items-center
              w-full

              ${sidebarOpen
                ? "gap-3"
                : "justify-center"
              }
            `}
          >

            <FiLogOut className="text-[18px]" />

            {sidebarOpen && (

              <span className="text-sm font-medium">
                Logout
              </span>

            )}

          </div>

        </button>

      </div>

    </div>
  );
}