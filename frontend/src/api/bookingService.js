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
    }
};

export default bookingService;
