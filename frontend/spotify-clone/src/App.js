import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import SearchBar from './components/SearchBar';

function App() {
    const [token, setToken] = useState(null);
    const [view, setView] = useState('login');

    const containerStyle = {
        backgroundColor: '#000',
        color: '#1DB954',
        minHeight: '100vh', // Cambiado a minHeight
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.5s ease-in-out'
    };
    
    const appStyle = {
        backgroundColor: '#000',
        color: '#1DB954',
        minHeight: '100vh', // Cambiado a minHeight
        display: 'flex',
        flexDirection: 'row',
        transition: 'all 0.5s ease-in-out'
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

    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = '#1ed760';
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = '#1DB954';
    };

    return (
        <div style={token ? appStyle : containerStyle}>
            {!token && view === 'login' && <Login onLogin={(token) => setToken(token)} />}
            {!token && view === 'register' && <Register onRegister={() => setView('login')} />}
            {token && <SearchBar token={token} />}
            {!token && (
                <button
                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                    style={buttonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {view === 'login' ? 'Register' : 'Back to Login'}
                </button>
            )}
        </div>
    );
}

export default App;