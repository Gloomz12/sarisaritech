import React, { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [greeting, setGreeting] = useState("");

  const [emoji, setEmoji] = useState("");

  const [ownerName, setOwnerName] = useState("Store");

  /* LOAD USER */

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.owner_name) {
      setOwnerName(user.owner_name);
    }
  }, []);

  /* GREETING */

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");

        setEmoji("🌞");
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Good afternoon");

        setEmoji("☀️");
      } else if (hour >= 18 && hour < 22) {
        setGreeting("Good evening");

        setEmoji("🌙");
      } else {
        setGreeting("Good night");

        setEmoji("✨");
      }
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        relative
        overflow-hidden

        bg-gradient-to-br
        from-[#fff8f1]
        to-[#fdf5eb]

        dark:from-[#111827]
        dark:to-[#0F172A]

        rounded-[28px]

        border
        border-white/50
        dark:border-[#1F2937]

        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1

        transition-all
        duration-300

        px-8
        py-6

        flex
        items-center
        justify-between

        min-h-[200px]
      "
    >
      {/* LEFT */}

      <div className="z-10 max-w-[56%]">
        {/* GREETING */}

        <div className="flex items-center gap-3">
          <div
            className="
              w-11
              h-11

              rounded-full

              bg-orange-100
              dark:bg-orange-500/10

              flex
              items-center
              justify-center

              text-lg
            "
          >
            {emoji}
          </div>

          <div>
            <p
              className="
                text-orange-500
                font-bold
                text-base
              "
            >
              {greeting}!
            </p>

            <p
              className="
                text-gray-500
                dark:text-gray-400

                text-sm
                mt-1
              "
            >
              Your store is doing great today.
            </p>
          </div>
        </div>

        {/* TITLE */}

        <h1
          className="
            mt-4

            text-[36px]
            leading-[1.05]

            tracking-[-2px]

            font-black

            text-[#0F172A]
            dark:text-white
          "
        >
          Welcome to {ownerName}
          <br />
          <span
            className="
              text-orange-500
            "
          >
            Sari Sari Store
          </span>
        </h1>

        {/* SUBTITLE */}

        <p
          className="
            mt-3
            text-base

            text-gray-500
            dark:text-gray-400
          "
        >
          Here's what's happening with your store today.
        </p>
      </div>

      {/* RIGHT IMAGE */}

      <div
        className="
          absolute
          right-4
          bottom-0

          h-full

          flex
          items-end
        "
      >
        <img
          src="/images/house_dashboard.png"
          alt="store"
          className="
            w-[250px]
            object-contain
            opacity-95
          "
        />
      </div>
    </div>
  );
}
