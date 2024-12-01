import React, { useState } from 'react';

function PlaylistList({ playlists, token }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);

    const handlePlaylistClick = async (playlistId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_ENDPOINT_PLAYLISTS}/${playlistId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSongs(data.items);
            setSelectedPlaylist(playlistId);
        } catch (err) {
            console.error('Failed to fetch playlist tracks', err);
        }
    };

    return (
        <div>
            {playlists.map((playlist) => (
                <div key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
                    <h3>{playlist.name}</h3>
                </div>
            ))}
            {selectedPlaylist && (
                <div>
                    <h2>Playlist Songs</h2>
                    {songs.map((song) => (
                        <div key={song.track.id}>
                            <p>{song.track.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlaylistList;