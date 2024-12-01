import React, { useState } from 'react';

function AddSongToPlaylist({ token }) {
    const [playlistName, setPlaylistName] = useState('');
    const [songTitle, setSongTitle] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleAddSong = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_ENDPOINT_ADD_SONG, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ playlist_name: playlistName, song_title: songTitle }),
            });
            if (response.ok) {
                setSuccess(true);
                setError(null);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to add song');
            }
        } catch (err) {
            setError('Something went wrong.');
        }
    };

    return (
        <div>
            <h2>Add Song to Playlist</h2>
            <input
                type="text"
                placeholder="Playlist Name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                style={{ padding: '10px', margin: '10px', borderRadius: '5px' }}
            />
            <input
                type="text"
                placeholder="Song Title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                style={{ padding: '10px', margin: '10px', borderRadius: '5px' }}
            />
            <button
                onClick={handleAddSong}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1DB954', color: '#fff' }}
            >
                Add Song
            </button>
            {success && <p style={{ color: 'green' }}>Song added successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AddSongToPlaylist;
