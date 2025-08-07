import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/common/Navbar';
import useAuth from './hooks/useAuth';

function App() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login showSignupLink={true} />} />
                <Route path="/login" element={<Login showSignupLink={true} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
