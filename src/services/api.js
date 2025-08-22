import axios from 'axios';

// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // for JWT cookie
});

// If a token is stored in localStorage, set it on the axios instance so requests
// include Authorization: Bearer <token> as a fallback for environments where
// cookies are not sent cross-origin.
const savedToken = localStorage.getItem('jobgenie_jwt');
if (savedToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

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
        // backend now returns the jwt in the response body as well as a cookie
        const token = response.data?.token;
        if (token) {
            localStorage.setItem('jobgenie_jwt', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
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

// Upload resume file (multipart/form-data). Expects backend route POST /resume/upload
// Returns: { extractedText: string, fileUrl?: string, ... }
export const uploadResume = async (file) => {
    if (!file) throw new Error('No file provided');

    const form = new FormData();
    form.append('resume', file);

    try {
    // backend registers the route under /api/protected/resume/upload
    const response = await api.post('/protected/resume/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // increase timeout for larger files if necessary
            timeout: 120000,
        });
        return response.data;
    } catch (error) {
        // normalize error message
        const msg = error.response?.data?.error || error.response?.data || error.message || 'Upload failed';
        throw msg;
    }
};

export default api;
