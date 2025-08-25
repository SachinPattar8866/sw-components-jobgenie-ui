import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/dashboard/Layout';
import useAuth from './hooks/useAuth';

function App() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login showSignupLink={true} />} />
                <Route path="/login" element={<Login showSignupLink={true} />} />
                <Route path="/signup" element={<Signup />} />

                {/* Dashboard routes nested under Layout */}
                <Route path="/dashboard" element={user ? <Layout /> : <Navigate to="/login" />}>
                    <Route index element={<Navigate to="/dashboard/uploads" replace />} />
                    <Route path="uploads" element={<Dashboard />} />
                    <Route path="score" element={<div>Resume Score (WIP)</div>} />
                    <Route path="rewrite" element={<div>AI Rewrite (WIP)</div>} />
                    <Route path="match" element={<div>Job Match (WIP)</div>} />
                    <Route path="roadmap" element={<div>Career Roadmap (WIP)</div>} />
                    <Route path="settings" element={<div>Settings (WIP)</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
