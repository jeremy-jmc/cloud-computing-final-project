import React, { useState, useEffect } from 'react';

function SongList({ songs }) {
    const [playlists, setPlaylists] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [error, setError] = useState(null);
    const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

    useEffect(() => {
        // Fetch playlists when component mounts
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_ENDPOINT_PLAYLISTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_email: sessionStorage.getItem('user_email') })
            });
            const data = await response.json();
            setPlaylists(data.body);
        } catch (err) {
            setError('Failed to fetch playlists');
        }
    };

    const addSongToPlaylist = (playlistName) => {
        console.log(selectedSong);
        fetch(process.env.REACT_APP_ENDPOINT_ADD_SONG, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "playlist_name": `${sessionStorage.getItem('user_email')}#${playlistName}`,
                "song_title": selectedSong.song_title,
                "artist_name": selectedSong.artist_name
            }),
            // redirect: "follow"
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (result.statusCode === 200) {
                    console.log(result.body.message);
                }
            })
            .catch((error) => console.error(error));
    };

    if (songs == null || songs.length === 0) {
        return <p style={{ color: '#fff', textAlign: 'center' }}>No songs found</p>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {songs.map((song) => (
                <div key={song.song_title} style={cardStyle}>
                    <h3>{song.song_title}</h3>
                    <p>{song.artist_name || ''}</p>
                    <p>{song.album_name || ''}</p>
                    <p>{Math.floor((song.duration || song.song_duration) / 60)}:{('0' + ((song.duration || song.song_duration) % 60)).slice(-2)}</p>
                    <button
                        style={buttonStyle}
                        onClick={() => console.log(`Playing ${song.song_title}`)}
                    >
                        Play
                    </button>
                    <button
                        style={buttonStyle}
                        onClick={() => {
                            setSelectedSong(song);
                            setShowPlaylistSelector(true);
                        }}
                    >
                        Add to Playlist
                    </button>
                </div>
            ))}
            {showPlaylistSelector && (
                <div style={modalStyle}>
                    <h3>Select Playlist to Add Music</h3>
                    <div>
                        {playlists.map((playlist) => (
                            <button
                                key={playlist.playlist_name}
                                style={playlistButtonStyle}
                                onClick={() => {
                                    addSongToPlaylist(playlist.playlist_name);
                                    setShowPlaylistSelector(false);
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#14833b'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#1DB954'}
                            >
                                {playlist.playlist_name}
                            </button>
                        ))}
                    </div>
                    <button style={closeButtonStyle} onClick={() => setShowPlaylistSelector(false)}>Close</button>
                </div>
            )}
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#282828',
    color: '#fff',
    padding: '20px',
    margin: '10px',
    borderRadius: '10px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
};

const buttonStyle = {
    marginTop: '10px',
    marginRight: '5px',
    padding: '10px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#282828',
    color: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    textAlign: 'center',
    width: '300px', // Make it proportional
};

const playlistButtonStyle = {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%', // Make buttons full width
    transition: 'background-color 0.3s', // Add animation
};

const closeButtonStyle = {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%', // Make button full width
};

export default SongList;