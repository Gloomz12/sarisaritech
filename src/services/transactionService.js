import api from './api';

const transactionService = {
    
    getAllTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    searchTransactions: async (query) => {
        const response = await api.get(`/transactions/search?q=${query}`);
        return response.data;
    },

    createTransaction: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    },

    getTransactionDetails: async (id) => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    }
};

export default transactionService;