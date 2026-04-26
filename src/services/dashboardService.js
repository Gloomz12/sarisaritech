import api from './api';

const dashboardService = {
    getQuickStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    getSalesPerformance: async (period = '7days') => {
        const response = await api.get(`/dashboard/performance?period=${period}`);
        return response.data;
    }
};

export default dashboardService;