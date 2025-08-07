import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupWithEmail } from '../../services/firebase';
import { signup } from '../../services/api';
import { getAuth, signOut } from 'firebase/auth';
import './Signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const idToken = await signupWithEmail(email, password);
            await signup(idToken, fullName);
            alert('Signup successful!');
            const auth = getAuth();
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err);
            setError('Signup failed. Email might already be used.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                />
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
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}

export default Signup;
