import React, { useState } from 'react';

function CreatePlaylist({ token }) {
    const [playlistName, setPlaylistName] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleCreatePlaylist = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_ENDPOINT_CREATE_PLAYLIST, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ playlist_name: playlistName }),
            });
            if (response.ok) {
                setSuccess(true);
                setError(null);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to create playlist');
            }
        } catch (err) {
            setError('Something went wrong.');
        }
    };

    return (
        <div>
            <h2>Create Playlist</h2>
            <input
                type="text"
                placeholder="Playlist Name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                style={{ padding: '10px', margin: '10px', borderRadius: '5px' }}
            />
            <button
                onClick={handleCreatePlaylist}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1DB954', color: '#fff' }}
            >
                Create
            </button>
            {success && <p style={{ color: 'green' }}>Playlist created successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default CreatePlaylist;
