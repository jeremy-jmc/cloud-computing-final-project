import React from 'react';

function ArtistList({ artists }) {
    if (!artists.length) return null;

    return (
        <div>
            <h2>Artists</h2>
            <ul>
                {artists.map((artist) => (
                    <li key={artist.artist_name}>{artist.artist_name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ArtistList;
