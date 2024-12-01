import React, { useState } from 'react';

function Login({ onLogin }) {
    const [email, setEmail] = useState('geraldine_austin@gmail.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            console.log('endpoint login');
            const response = await fetch(process.env.REACT_APP_ENDPOINT_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),

            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                sessionStorage.setItem('user_email', email);
                sessionStorage.setItem('token', data.token);
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
