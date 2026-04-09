import axios from 'axios';
import API_BASE_URL from './apiConfig';

const eventService = {
    getUpcomingEvents: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    getEventById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching event ${id}:`, error);
            throw error;
        }
    },

    getMyEvents: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/my-events`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching my events:', error);
            throw error;
        }
    },

    updateEvent: async (id, eventData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/events/${id}`, eventData);
            return response.data;
        } catch (error) {
            console.error(`Error updating event ${id}:`, error);
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/events/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting event ${id}:`, error);
            throw error;
        }
    }
};

export default eventService;
