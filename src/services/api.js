import axios from 'axios';

// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // for JWT cookie
});

export const signup = async (idToken) => {
    try {
        const response = await api.post('/auth/signup', { idToken });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Signup failed';
    }
};

export const login = async (idToken) => {
    try {
        const response = await api.post('/auth/login', { idToken });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Login failed';
    }
};

export const getDashboardData = async () => {
    try {
        const response = await api.get('/protected/dashboard');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch dashboard data';
    }
};
