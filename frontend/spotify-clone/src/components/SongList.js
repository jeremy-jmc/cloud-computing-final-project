import React from 'react';

function SongList({ songs }) {
    if (!songs.length) return null;

    return (
        <div>
            <h2>Songs</h2>
            <ul>
                {songs.map((song) => (
                    <li key={song.id}>
                        {song.name} - {song.artist}
                        <button
                            style={{ marginLeft: '10px', padding: '5px', backgroundColor: '#1DB954', color: '#fff' }}
                            onClick={() => console.log(`Playing ${song.name}`)}
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
