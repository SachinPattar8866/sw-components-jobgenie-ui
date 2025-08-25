import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkBackendSession = async () => {
            try {
                // api instance already applies Authorization header from localStorage
                const res = await api.get('/protected/dashboard');
                if (res.status === 200) {
                    setUser(true);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkBackendSession();
    }, []);

    return { user, isLoading };
}

export default useAuth;
