import React, { useState } from 'react';

function Login({ onLogin, onRegister }) {
    const [email, setEmail] = useState('linda_choate@gmail.com');
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(180deg, #121212 0%, #282828 100%)' }}>
            <div style={{ textAlign: 'center', padding: '40px', borderRadius: '10px', backgroundColor: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '400px' }}>
                <h1>Spotify Clone</h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px', margin: '10px', borderRadius: '5px', width: '80%', backgroundColor: '#282828', color: '#fff', border: 'none' }}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', margin: '10px', borderRadius: '5px', width: '80%', backgroundColor: '#282828', color: '#fff', border: 'none' }}
                />
                <br />
                <button
                    onClick={handleLogin}
                    style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1DB954', color: '#fff' }}
                >
                    Login
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button
                    onClick={onRegister}
                    style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1DB954', color: '#fff', marginTop: '10px' }}
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Login;
