import React from 'react';

function SongList({ songs }) {
    if (!songs.length) return null;

    return (
        <div>
            <h2>Songs</h2>
            <ul>
                {songs.map((song) => (
                    <li key={song.song_title}>
                        {song.song_title} - {song.album_name}
                        <button
                            style={{ marginLeft: '10px', padding: '5px', backgroundColor: '#1DB954', color: '#fff' }}
                            onClick={() => console.log(`Playing ${song.song_title}`)}
                        >
                            Play
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SongList;
