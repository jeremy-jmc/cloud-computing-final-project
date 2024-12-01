import React, { useState } from 'react';

function PlaylistList({ playlists, onSelectPlaylist, fetchPlaylists }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [hoveredPlaylist, setHoveredPlaylist] = useState(null);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [error, setError] = useState(null);

    const handleCreatePlaylist = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_ENDPOINT_CREATE_PLAYLIST, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    user_email: sessionStorage.getItem('user_email'),
                    playlist_name: newPlaylistName 
                }),
            });
            const result = await response.json();
            console.log(result);

            setShowCreateMenu(false);
            setNewPlaylistName('');
            setError(null);
            fetchPlaylists(); // Fetch playlists after creating a new one

        } catch (error) {
            console.error(error);
            setError('Failed to create playlist');
        }
    };

    if (playlists == null || playlists.length === 0) {
        return <p style={{ color: '#fff', textAlign: 'center' }}>No playlists available</p>;
    }

    const handleSelectPlaylist = (playlistName) => {
        setSelectedPlaylist(playlistName);
        onSelectPlaylist(playlistName);
        setTimeout(() => {
            setSelectedPlaylist(null);
        }, 300); // Adjust the delay as needed
    };

    const handleMouseEnter = (playlistName) => {
        setHoveredPlaylist(playlistName);
    };

    const handleMouseLeave = () => {
        setHoveredPlaylist(null);
    };

    return (
        <div style={sidebarStyle}>
            <button onClick={() => setShowCreateMenu(true)} style={createButtonStyle}>Create Playlist</button>
            {playlists.map((playlist) => (
                <div
                    key={playlist.playlist_name}
                    style={{
                        ...playlistCardStyle,
                        ...(selectedPlaylist === playlist.playlist_name ? selectedCardStyle : {}),
                        ...(hoveredPlaylist === playlist.playlist_name ? hoverCardStyle : {}),
                    }}
                    onClick={() => handleSelectPlaylist(playlist.playlist_name)}
                    onMouseEnter={() => handleMouseEnter(playlist.playlist_name)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={playlistInfoStyle}>
                        <h3 style={playlistNameStyle}>{playlist.playlist_name}</h3>
                        <p style={descriptionStyle}>{playlist.descripcion}</p>
                        <p style={likesStyle}>Likes: {playlist.likes}</p>
                        <p style={songsNumberStyle}>Songs: {playlist.songs_number}</p>
                    </div>
                </div>
            ))}
            {showCreateMenu && (
                <div style={floatingMenuStyle}>
                    <h3>Create New Playlist</h3>
                    <input
                        type="text"
                        placeholder="Playlist Name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        style={{ padding: '10px', margin: '10px', borderRadius: '5px' }}
                    />
                    <button onClick={handleCreatePlaylist} style={createButtonStyle}>Create</button>
                    <button onClick={() => setShowCreateMenu(false)} style={cancelButtonStyle}>Cancel</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            )}
        </div>
    );
}

const sidebarStyle = {
    width: '250px',
    // backgroundColor: '#282828',
    padding: '10px',
    overflowY: 'auto',
    height: '100vh',
};

const playlistCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#383838',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
};

const selectedCardStyle = {
    backgroundColor: '#1DB954',
    transform: 'scale(1.05)',
};

const hoverCardStyle = {
    backgroundColor: '#4c4c4c',
    transform: 'scale(1.05)',
};

const playlistInfoStyle = {
    marginTop: '10px',
};

const playlistNameStyle = {
    color: '#fff',
    fontSize: '16px',
    margin: '5px 0',
};

const descriptionStyle = {
    color: '#ccc',
    fontSize: '14px',
    margin: '5px 0',
};

const likesStyle = {
    color: '#1DB954',
    fontSize: '14px',
    margin: '5px 0',
};

const songsNumberStyle = {
    color: '#ccc',
    fontSize: '14px',
    margin: '5px 0',
};

const createButtonStyle = {
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#AFAFFA',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const cancelButtonStyle = {
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#ff4c4c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const floatingMenuStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 255, 0.8)', // Changed to blue with rgba
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
};

export default PlaylistList;

// [
//     {
//         "total_time": 1121.835,
//         "playlist_name": "Liked Songs",
//         "wallpaper_s3": "s3://playlists/18ab288fb54e44bb9ddb591141c2c158.jpg",
//         "descripcion": "Party time!",
//         "created_at": "2003-03-03",
//         "likes": 472,
//         "user_email": "geraldine_austin@gmail.com",
//         "songs_number": 60
//     },
//     {
//         "total_time": 0,
//         "playlist_name": "Rock80s",
//         "wallpaper_s3": "s3://playlists/d4c83fcec5b546e8bc954657786e6bf3.jpg",
//         "descripcion": "",
//         "created_at": "2024-12-01 04:58:38",
//         "likes": 0,
//         "user_email": "geraldine_austin@gmail.com",
//         "songs_number": 0
//     }
// ]