// src/component/aiinsight/mockData.js

export const associationRules = [
  {
    products: "Coke + Chips",
    support: "18%",
    confidence: "75%",
    lift: "1.85",
  },

  {
    products: "Coffee + Sugar",
    support: "15%",
    confidence: "72%",
    lift: "1.62",
  },
];

export const restockRecommendations = [
  {
    product: "Coke 330ml",
    stock: 20,
    demand: 52,
    suggested: "+32 units",
    priority: "High",
  },

  {
    product: "Piattos",
    stock: 25,
    demand: 68,
    suggested: "+43 units",
    priority: "Medium",
  },
];
