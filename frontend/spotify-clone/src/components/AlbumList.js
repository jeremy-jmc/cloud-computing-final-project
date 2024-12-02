import React from 'react';

function AlbumList({ albums }) {
    if (albums == null || albums.length === 0) {
        return <p style={{ color: '#fff', textAlign: 'center' }}>No albums found</p>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {albums.map((album) => (
                <div key={album.album_name} style={cardStyle}>
                    {/* <img src={album.wallpaper_s3} alt={album.album_name} style={imageStyle} /> */}
                    <h3 style={titleStyle}>{album.album_name}</h3>
                    <p style={captionStyle}>Artist: {album.artist_name}</p>
                    <p style={captionStyle}>Popularity: {album.album_popularity.toFixed(1)}</p>
                    <p style={captionStyle}>Duration: {(album.duration / 60).toFixed(1)} minutes</p>
                    <p style={captionStyle}>{album.songs_number} songs</p>
                </div>
            ))}
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: '20px',
    margin: '10px',
    borderRadius: '15px',
    width: '220px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
};
const cardHover = (e) => {
    Object.assign(e.target.style, cardHoverStyle);
};

const cardUnhover = (e) => {
    Object.assign(e.target.style, cardStyle);
};

const imageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '15px',
};

const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
};

const captionStyle = {
    fontSize: '14px',
    color: '#b3b3b3',
    marginBottom: '5px',
};

const cardHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
};


export default AlbumList;