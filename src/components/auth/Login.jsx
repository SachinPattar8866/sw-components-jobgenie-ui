import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../services/firebase';
import { login } from '../../services/api';
import './Login.css';

function Login({ showSignupLink }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const idToken = await loginWithEmail(email, password);
            const res = await login(idToken);
            // token is stored by api.login; proceed
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Log In</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>

                {showSignupLink && (
                    <div className="signup-link-container">
                        <span>Don't have an account?</span>
                        <button
                            type="button"
                            className="signup-link"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Login;
