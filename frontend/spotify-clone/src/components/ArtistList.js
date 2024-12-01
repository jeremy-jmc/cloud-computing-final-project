import React from 'react';

function ArtistList({ artists }) {
    if (artists == null || artists.length === 0) {
        return <p style={{ color: '#fff', textAlign: 'center' }}>No artists found</p>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {artists.map((artist) => (
                <div key={artist.artist_name} style={cardStyle}>
                    <h3>{artist.artist_name}</h3>
                    <p>Popularity: {artist.popularity}</p>
                    <div style={blockStyle}>
                        <h4>Genres</h4>
                        <p>{artist.genres}</p>
                    </div>
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
    width: '200px', // Ajusta el ancho aquí para hacer las cards más delgadas
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
};

const blockStyle = {
    backgroundColor: '#383838',
    padding: '5px',
    borderRadius: '2px',
    marginTop: '5px',
};

export default ArtistList;

// {
//     "popularity": 47.64705882352941,
//     "artist_name": "Elton John",
//     "created_at": "1980-05-13",
//     "genres": "['rock']",
//     "subgenres": [
//         "classic rock",
//         "permanent wave"
//     ]
// }