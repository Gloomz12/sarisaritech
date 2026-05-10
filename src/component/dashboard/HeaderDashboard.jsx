import React, {
  useState,
  useEffect,
} from "react";

import {
  FiClock,
  FiCalendar,
} from "react-icons/fi";

export default function HeaderDashboard() {

  const [dateTime, setDateTime] =
    useState(new Date());

  const [user, setUser] =
    useState(null);

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

  const timer = setInterval(() => {
    setDateTime(new Date());
  }, 1000);

  window.addEventListener(
    "userUpdated",
    loadUser
  );

  return () => {

    clearInterval(timer);

    window.removeEventListener(
      "userUpdated",
      loadUser
    );
  };

}, []);

  const timeString =
    dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const dateString =
    dateTime.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

  return (

    <div
      className="
        bg-white
        dark:bg-[#111827]

        h-[78px]

        border-b
        border-gray-100
        dark:border-[#1F2937]

        px-6

        flex
        items-center
        justify-between

        transition-all
        duration-300
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-5">

        <div>

          <h2
            className="
              text-[22px]
              font-bold

              text-gray-800
              dark:text-white

              transition-all
            "
          >
            {user?.store_name ||
              "SariSariTech"}
          </h2>

          <p
            className="
              text-[13px]

              text-gray-500
              dark:text-gray-400

              transition-all
            "
          >
            Owner:
            {" "}

            <span className="font-medium">

              {user?.owner_name ||
                "Store Owner"}

            </span>

          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-6">

        <div
          className="
            flex
            items-center
            gap-2

            text-[14px]

            text-gray-600
            dark:text-gray-300

            transition-all
          "
        >

          <FiClock />

          <span>
            {timeString}
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2

            text-[14px]

            text-gray-600
            dark:text-gray-300

            transition-all
          "
        >

          <FiCalendar />

          <span>
            {dateString}
          </span>

        </div>

      </div>

    </div>
  );
}