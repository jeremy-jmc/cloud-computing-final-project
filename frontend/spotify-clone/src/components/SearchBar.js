import React, { useState } from 'react';
import SongList from './SongList';
import ArtistList from './ArtistList';

function SearchBar({ token }) {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const [songRes, artistRes] = await Promise.all([
                fetch(`/songs?name=${query}`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`/artists?name=${query}`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const songsData = await songRes.json();
            const artistsData = await artistRes.json();

            setSongs(songsData);
            setArtists(artistsData);
        } catch (err) {
            setError('Search failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Search Music</h1>
            <input
                type="text"
                placeholder="Search songs or artists"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: '10px', width: '60%', margin: '10px' }}
            />
            <button
                onClick={handleSearch}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1DB954', color: '#fff' }}
            >
                Search
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <SongList songs={songs} />
            <ArtistList artists={artists} />
        </div>
    );
}

export default SearchBar;
