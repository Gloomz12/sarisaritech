export const stockStatus = (
  stock,
  minStock
) => {

  if (stock <= 0) {
    return {
      label: "Out of Stock",
      color: "text-red-500",
    };
  }

  if (stock <= minStock) {
    return {
      label: "Low Stock",
      color: "text-yellow-500",
    };
  }

  return {
    label: "In Stock",
    color: "text-green-500",
  };
};