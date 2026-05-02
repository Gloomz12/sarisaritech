import api from "./api";

const transactionService = {
  // GET ALL TRANSACTIONS
  getAllTransactions: async () => {
    const response = await api.get("/transactions");
    return response.data;
  },

  // CREATE TRANSACTION
  createTransaction: async (data) => {
    const response = await api.post("/transactions", data);
    return response.data;
  },
};

export default transactionService;