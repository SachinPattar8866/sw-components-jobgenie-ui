import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import axios from 'axios';

function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkBackendSession = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/protected/dashboard", {
                    withCredentials: true,
                });
                if (res.status === 200) {
                    setUser(true);  // Set to 'true' since we don't get user data from backend
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
