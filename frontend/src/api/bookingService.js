import apiClient from './apiClient';

const bookingService = {
    createBooking: async (eventId, ticketCount) => {
        const response = await apiClient.post('/bookings', { eventId, ticketCount });
        return response.data;
    },

    getMyBookings: async () => {
        const response = await apiClient.get('/bookings/my-bookings');
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await apiClient.get(`/bookings/${id}`);
        return response.data;
import axios from 'axios';
import API_BASE_URL from './apiConfig';

const bookingService = {
    // Other booking methods by Ashen...

    uploadReceipt: async (id, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_BASE_URL}/api/bookings/${id}/upload-receipt`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading receipt for booking ${id}:`, error);
            throw error;
        }
    }
};

export default bookingService;
