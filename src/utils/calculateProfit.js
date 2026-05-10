export const calculateProfit = (
  sellingPrice,
  costPrice,
  quantity
) => {
  return (
    (sellingPrice - costPrice) * quantity
  );
};