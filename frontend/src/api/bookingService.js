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
