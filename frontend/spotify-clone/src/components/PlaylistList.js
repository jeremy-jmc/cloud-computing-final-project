import React, { useState } from 'react';

function PlaylistList({ playlists, onSelectPlaylist }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [hoveredPlaylist, setHoveredPlaylist] = useState(null);

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