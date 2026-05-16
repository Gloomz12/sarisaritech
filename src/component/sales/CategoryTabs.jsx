import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryTabs({ categories, selectedCategory, setSelectedCategory }) {
  const scrollRef = useRef(null);

  const [showButtons, setShowButtons] = useState(false);

  const checkOverflow = () => {
    if (scrollRef.current) {
      const hasOverflow = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;

      setShowButtons(hasOverflow);
    }
  };

  useEffect(() => {
    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [categories]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -250,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      {/* LEFT BUTTON */}

      {showButtons && (
        <button
          onClick={scrollLeft}
          className="
            shrink-0

            h-10
            w-10

            rounded-2xl

            border
            border-gray-200
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

            flex
            items-center
            justify-center

            text-[#0F172A]
            dark:text-white

            hover:border-orange-300
            dark:hover:border-orange-500/40

            hover:bg-orange-50
            dark:hover:bg-orange-500/10

            transition-all
            duration-300
          "
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* TABS */}

      <div
        ref={scrollRef}
        className="
          flex
          items-center
          gap-2

          overflow-hidden

          scroll-smooth

          flex-1
        "
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              shrink-0

              h-10

              px-4

              rounded-2xl

              text-[13px]
              font-semibold

              whitespace-nowrap

              transition-all
              duration-300

              ${
                selectedCategory === category
                  ? `
                    bg-orange-500
                    text-white
                    shadow-sm
                  `
                  : `
                    bg-white
                    dark:bg-[#111827]

                    border
                    border-gray-200
                    dark:border-[#1F2937]

                    text-[#0F172A]
                    dark:text-white

                    hover:border-orange-300
                    dark:hover:border-orange-500/40

                    hover:bg-orange-50
                    dark:hover:bg-orange-500/10
                  `
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* RIGHT BUTTON */}

      {showButtons && (
        <button
          onClick={scrollRight}
          className="
            shrink-0

            h-10
            w-10

            rounded-2xl

            border
            border-gray-200
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

            flex
            items-center
            justify-center

            text-[#0F172A]
            dark:text-white

            hover:border-orange-300
            dark:hover:border-orange-500/40

            hover:bg-orange-50
            dark:hover:bg-orange-500/10

            transition-all
            duration-300
          "
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
