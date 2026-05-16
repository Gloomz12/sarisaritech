export function getStockStatus(stock, minLevel) {
  const currentStock = Number(stock);

  const minimum = Number(minLevel);

  // OUT OF STOCK

  if (currentStock <= 0) {
    return "critical";
  }

  // LOW STOCK

  if (currentStock <= minimum) {
    return "low";
  }

  // GOOD STOCK

  return "good";
}
