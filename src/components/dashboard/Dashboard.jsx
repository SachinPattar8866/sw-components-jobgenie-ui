import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const data = await getDashboardData();
                setMessage(data.message);
                setError('');
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please log in.');
                setMessage('');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <p className="success-message">{message}</p>
            )}
        </div>
    );
}

export default Dashboard;