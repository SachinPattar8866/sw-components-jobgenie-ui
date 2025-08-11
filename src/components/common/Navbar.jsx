import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">Job Genie</Link>
            <div className="navbar-links">
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                ) : (
                    <Link to="/dashboard">Dashboard</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;