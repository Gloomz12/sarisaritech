import api from './api';

const productService = {
    getAllProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    updateProduct: async (id, updateData) => {
        const response = await api.patch(`/products/${id}`, updateData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    restockProduct: async (id, amount) => {
        const response = await api.post(`/products/${id}/restock`, { amount });
        return response.data;
    }
};

export default productService;