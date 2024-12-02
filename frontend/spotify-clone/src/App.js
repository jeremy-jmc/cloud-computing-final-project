import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import SearchBar from './components/SearchBar';

function App() {
    const [token, setToken] = useState(null);
    const [view, setView] = useState('login');

    
    
    const appStyle = {
        background: 'linear-gradient(180deg, #121212 0%, #282828 100%)',
        color: '#1DB954',
        minHeight: '100vh', // Cambiado a minHeight
        display: 'flex',
        flexDirection: 'row',
        transition: 'all 0.5s ease-in-out'
    };

    const containerStyle = {
        background: 'linear-gradient(180deg, #121212 0%, #282828 100%)',
        color: '#1DB954',
        minHeight: '100vh', // Cambiado a minHeight
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.5s ease-in-out'
    };

    
    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = '#1ed760';
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = '#1DB954';
    };


    const buttonStyle = {
        color: '#fff',
        backgroundColor: '#1DB954',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '25px',
        marginTop: '20px',
        transition: 'background-color 0.3s ease'
    };


    return (
        <div style={token ? appStyle : containerStyle}>
            {!token && view === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Login onLogin={(token) => setToken(token)} onRegister={() => setView('register')} />
                </div>
            )}
            {!token && view === 'register' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Register onRegister={() => setView('login')} />
                </div>
            )}
            {token && <SearchBar token={token} />}
        </div>
    );
}

export default App;