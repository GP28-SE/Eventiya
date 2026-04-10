import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bookings';

const createBooking = async (eventId, ticketCount) => {
    const response = await axios.post(API_URL, { eventId, ticketCount });
    return response.data;
};

const getMyBookings = async () => {
    const response = await axios.get(`${API_URL}/my-bookings`);
    return response.data;
};

const getBookingById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export default {
    createBooking,
    getMyBookings,
    getBookingById
};
