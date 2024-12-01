import React from 'react';

function SongList({ songs }) {
    if (songs == null || songs.length === 0) {
        return <p style={{ color: '#fff', textAlign: 'center' }}>No songs available</p>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {songs.map((song) => (
                <div key={song.song_title} style={cardStyle}>
                    <h3>{song.song_title}</h3>
                    <p>{song.album_name || song.artist_name}</p>
                    <p>{Math.floor((song.duration || song.song_duration) / 60)}:{('0' + ((song.duration || song.song_duration) % 60)).slice(-2)}</p>
                    <button
                        style={buttonStyle}
                        onClick={() => console.log(`Playing ${song.song_title}`)}
                    >
                        Play
                    </button>
                </div>
            ))}
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
    padding: '10px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default SongList;