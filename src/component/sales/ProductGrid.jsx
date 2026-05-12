import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,

  cart,

  increaseQuantity,
  decreaseQuantity,

  toggleFavorite,
}) {
  return (
    <div
      className="
        grid

        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5

        gap-4
      "
    >
      {products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);

        const quantity = cartItem?.quantity || 0;

        return (
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantity}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            toggleFavorite={toggleFavorite}
          />
        );
      })}
    </div>
  );
}
