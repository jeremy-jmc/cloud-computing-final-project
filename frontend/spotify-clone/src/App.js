import React, { useState } from 'react';
import Login from './components/Login';
import SearchBar from './components/SearchBar';
// require('dotenv').config();

function App() {
    const [token, setToken] = useState(null);

    return (
        <div style={{ backgroundColor: '#000', color: '#1DB954', height: '100vh', padding: '20px' }}>
            {token ? (
                <SearchBar token={token} />
            ) : (
                <Login onLogin={(token) => setToken(token)} />
            )}
        </div>
    );
}

export default App;
