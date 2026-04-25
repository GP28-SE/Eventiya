import apiClient from './apiClient';

const adminService = {
    getPendingEvents: async () => {
        const response = await apiClient.get('/api/admin/pending-events');
        return response.data;
    },

    getPendingPayments: async () => {
        const response = await apiClient.get('/api/admin/pending-payments');
        return response.data;
    },

    approveEvent: async (id, action) => {
        // action should be "APPROVE" or "REJECT"
        const response = await apiClient.patch(`/api/admin/approve-event/${id}?action=${action}`);
        return response.data;
    },

    verifyPayment: async (id, action) => {
        // action should be "APPROVE" or "REJECT"
        const response = await apiClient.patch(`/api/admin/verify-payment/${id}?action=${action}`);
        return response.data;
    },
    
    // For Phase 2:
    getFinancialStats: async () => {
        const response = await apiClient.get('/api/admin/financial-stats');
        return response.data;
    },

    getCommissionRate: async () => {
        const response = await apiClient.get('/api/admin/settings/commission');
        return response.data;
    },

    updateCommissionRate: async (value) => {
        const response = await apiClient.put(`/api/admin/settings/commission?value=${value}`);
        return response.data;
    }
};

export default adminService;
