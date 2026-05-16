// RestockGrid.jsx

import RestockCard from "./RestockCard";

export default function RestockGrid({ products, onRestock }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4

        gap-4

        auto-rows-fr
      "
    >
      {products.map((product) => (
        <RestockCard key={product.id} product={product} onRestock={onRestock} />
      ))}
    </div>
  );
}
