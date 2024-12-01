import React, { useState, useEffect } from 'react';
import SongList from './SongList';
import ArtistList from './ArtistList';
import AlbumList from './AlbumList';
import PlaylistList from './PlaylistList';

function SearchBar({ token }) {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_ENDPOINT_PLAYLISTS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setPlaylists(data.items);
            } catch (err) {
                setError('Failed to fetch playlists');
            }
        };

        fetchPlaylists();
    }, [token]);
    /**
     * REACT_APP_ENDPOINT_LOGIN
     * REACT_APP_ENDPOINT_SIGNUP
     * REACT_APP_ENDPOINT_SONGS
     * REACT_APP_ENDPOINT_ARTISTS
     * REACT_APP_ENDPOINT_CREATE_PLAYLIST
     * REACT_APP_ENDPOINT_ADD_SONG
     */
    const handleSearch = async () => {
        console.log('Handle search!');

        try {
            // 
            const [songRes, artistRes, albumRes] = await Promise.all([
                fetch(process.env.REACT_APP_ENDPOINT_SONGS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: query })
                }),
                fetch(process.env.REACT_APP_ENDPOINT_ARTISTS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ artist_name: query })
                }),
                fetch(process.env.REACT_APP_ENDPOINT_ALBUMS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ search: query })
                })
            ]);

            const songsData = await songRes.json();
            const artistsData = await artistRes.json();
            const albumsData = await albumRes.json();
            
            console.log(songsData.body.songs);
            console.log(artistsData);
            console.log(albumsData);

            let songs_data = songsData.body.songs;
            songs_data.sort((a, b) => b.popularity - a.popularity);


            setSongs(songs_data.slice(0, 5));
            setArtists(artistsData.body.slice(0, 5));
            setAlbums(albumsData.body);
        } catch (err) {
            setError('Something went wrong.');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <div style={{ width: '250px', backgroundColor: '#1DB954', padding: '20px', color: '#fff' }}>
                <h2>Playlists</h2>
                <PlaylistList playlists={playlists} token={token} />
            </div>
            <div style={{ flex: 1, padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1>Spotify Clone</h1>
                    <input
                        type="text"
                        placeholder="Search for songs, albums, or artists"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ padding: '10px', margin: '10px', borderRadius: '5px', width: '50%' }}
                    />
                    <button onClick={handleSearch} style={{ padding: '10px 20px', borderRadius: '5px', marginTop: '10px' }}>
                        Search
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div>
                    <h2>Songs</h2>
                    <SongList songs={songs} />
                    <h2>Artists</h2>
                    <ArtistList artists={artists} />
                    <h2>Albums</h2>
                    <AlbumList albums={albums} />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;