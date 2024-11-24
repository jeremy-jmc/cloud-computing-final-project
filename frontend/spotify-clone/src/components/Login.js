import React, { useState } from 'react';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await fetch('https://smh8qk9kza.execute-api.us-east-1.amazonaws.com/dev/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),

            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data.token);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong.');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Spotify Clone</h1>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px', margin: '10px', borderRadius: '5px' }}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px', margin: '10px', borderRadius: '5px' }}
            />
            <br />
            <button
                onClick={handleLogin}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1DB954', color: '#fff' }}
            >
                Login
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;
