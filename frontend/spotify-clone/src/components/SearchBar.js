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
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

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

    useEffect(() => {
        fetchPlaylists();
        const fetchRecommendations = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_ENDPOINT_RECOMMENDATIONS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: sessionStorage.getItem('user_email') })
                });
                const data = await response.json();
                console.log(data);
                setRecommendations(data.body.slice(0, 5));
            } catch (err) {
                setError('Failed to fetch recommendations');
            }
        }

        fetchRecommendations();
    }, [token]);

    const handleSearch = async () => {
        try {
            const [songRes, artistRes, albumRes] = await Promise.all([
                fetch(process.env.REACT_APP_ENDPOINT_SONGS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: query })
                }),
                fetch(process.env.REACT_APP_ENDPOINT_ARTISTS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artist_name: query })
                }),
                fetch(process.env.REACT_APP_ENDPOINT_ALBUMS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ search: query })
                })
            ]);

            const songsData = await songRes.json();
            const artistsData = await artistRes.json();
            const albumsData = await albumRes.json();

            setSongs(songsData.body.songs.slice(0, 5));
            setArtists(artistsData.body.slice(0, 5));
            setAlbums(albumsData.body);
        } catch (err) {
            setError('Something went wrong.');
        }
    };

    const handleSelectPlaylist = async (playlistName) => {
        try {
            const response = await fetch(process.env.REACT_APP_ENDPOINT_PLAYLIST_SONGS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: sessionStorage.getItem('user_email'),
                    playlist_name: playlistName
                })
            });
            const data = await response.json();
            console.log(data)
            setSongs(data.body);
            setSelectedPlaylist(playlistName);
        } catch (err) {
            setError('Failed to fetch playlist songs');
        }
    };

    const handleBackToSearch = () => {
        setSelectedPlaylist(null);
        setSongs([]);
        setArtists([]);
        setAlbums([]);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'linear-gradient(180deg, #121212 0%, #282828 100%)' }}>
            <div style={{ width: '250px', background: 'linear-gradient(180deg, #1DB954 0%, #1ED760 100%)', padding: '20px', color: '#fff', minHeight: '100vh' }}>
                <h2>Playlists</h2>
                <PlaylistList playlists={playlists} onSelectPlaylist={handleSelectPlaylist} fetchPlaylists={fetchPlaylists} />
                {/* Move the button inside PlaylistList */}
            </div>
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#121212', color: '#fff' }}>
                {selectedPlaylist ? (
                    <div>
                        <h2>{selectedPlaylist} Songs</h2>
                        <button onClick={handleBackToSearch} style={{ padding: '10px 20px', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#1DB954', color: '#fff' }}>
                            Back to Search
                        </button>
                        <SongList songs={songs} />
                    </div>
                ) : (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h1>Spotify Clone</h1>
                            <input
                                type="text"
                                placeholder="Search for songs, albums, or artists"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ padding: '10px', margin: '10px', borderRadius: '5px', width: '50%', backgroundColor: '#282828', color: '#fff', border: 'none' }}
                            />
                            <button onClick={handleSearch} style={{ padding: '10px 20px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#1DB954', color: '#fff' }}>
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
                            <h2>Recommendations Top 5</h2>
                            <SongList songs={recommendations.map(rec => ({
                                song_title: rec.song_title,
                                artist_name: rec.artist_name,
                                duration: rec.total_minutes * 60 // Convert minutes to seconds
                            }))} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;