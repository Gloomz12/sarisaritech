import { useRef } from "react";

export default function CategoryTabs({ categories, selectedCategory, setSelectedCategory }) {
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (!e.shiftKey) return;

    if (scrollRef.current) {
      e.preventDefault();

      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      className="
        category-scroll-container

        flex
        items-center
        gap-2

        overflow-x-scroll
        overflow-y-hidden

        pb-1

        scroll-smooth
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

                    border
                    border-gray-200

                    text-[#0F172A]

                    hover:border-orange-300
                  `
              }
            `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
