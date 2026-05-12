import {
  FiBox,
  FiRotateCcw,
  FiClock,
  FiPieChart,
  FiChevronRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Inventory",
      subtitle: "Manage products",
      icon: <FiBox />,
      path: "/inventory",
    },

    {
      title: "Restock",
      subtitle: "Manage restocking",
      icon: <FiRotateCcw />,
      path: "/restock",
    },

    {
      title: "History",
      subtitle: "View transactions",
      icon: <FiClock />,
      path: "/history",
    },

    {
      title: "Statistics",
      subtitle: "View reports",
      icon: <FiPieChart />,
      path: "/statistics",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4

        gap-5
      "
    >
      {actions.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
          className="
            group

            bg-white
            dark:bg-[#111827]

            border
            border-gray-100
            dark:border-[#1F2937]

            rounded-[26px]

            px-6
            py-5

            flex
            items-center
            justify-between

            shadow-sm

            hover:shadow-xl
            hover:-translate-y-1

            dark:hover:bg-[#1A2438]
            dark:hover:border-orange-500/20

            transition-all
            duration-300

            cursor-pointer
          "
        >
          {/* LEFT */}

          <div className="flex items-center gap-4">
            {/* ICON */}

            <div
              className="
                w-14
                h-14

                rounded-2xl

                bg-orange-50
                dark:bg-orange-500/10

                flex
                items-center
                justify-center

                text-[28px]
                text-orange-500

                group-hover:scale-110

                transition-all
                duration-300
              "
            >
              {item.icon}
            </div>

            {/* TEXT */}

            <div>
              <h3
                className="
                  font-bold
                  text-[18px]

                  text-gray-900
                  dark:text-white
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  text-gray-500
                  dark:text-gray-400

                  text-sm
                  mt-1
                "
              >
                {item.subtitle}
              </p>
            </div>
          </div>

          {/* ARROW */}

          <div
            className="
              text-gray-400
              dark:text-gray-500

              text-xl

              group-hover:text-orange-500
              group-hover:translate-x-1

              transition-all
              duration-300
            "
          >
            <FiChevronRight />
          </div>
        </div>
      ))}
    </div>
  );
}
