# https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset/code
# https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs?select=spotify_songs.csv
import kagglehub
import numpy as np
import os
import pandas as pd
from IPython.display import display
import uuid
import random
from tqdm import tqdm
from datetime import timedelta, datetime

np.random.seed(42)
random.seed(42)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)


spotify_dataset_path = kagglehub.dataset_download("joebeachcapital/30000-spotify-songs")

df = (
    pd.read_csv(os.path.join(spotify_dataset_path, "spotify_songs.csv"))   # os.path.join(path, "dataset.csv")
    # .drop(columns=['Unnamed: 0'])
    .dropna(how='any')
    # .loc[lambda df: df['track_artist'].str.isalnum()]
)
df = (
    df.merge(df[['track_artist']].drop_duplicates().assign(artist_email=lambda df: [f"{uuid.uuid4().hex}@spotify.com" for _ in range(len(df))]), on='track_artist')
)
df['duration'] = df['duration_ms'] / 1000

print("Dataset shape:", df.shape)
display(df)
df['track_album_release_date'] = pd.to_datetime(df['track_album_release_date'], format='mixed')

print(df.columns)
# df_individual.groupby(['artists', 'album_name']).size().reset_index(name='count').sort_values(by='count', ascending=False)


"""Artists {
    string email PK "Primary Key - Email único del artista"
    string artist_name "Sort Key - Nombre del artista"
    array genres "Array de géneros musicales"
    number popularity "Índice de popularidad"
    timestamp created_at "Fecha de creación"
    string record_label "Compañía discográfica"
    # string GSI1 "GSI1: record_label | Para búsquedas por compañía discográfica"
    string GSI2 "GSI2: genres | Para búsquedas por género musical"
}
"""

df_artist = (
    df
    .groupby('track_artist')
    .agg(
        genres=('playlist_genre', 'unique'),
        subgenres=('playlist_subgenre', 'unique'),
        popularity=('track_popularity', 'mean'),
        created_at=('track_album_release_date', 'first'),
        # email=('artist_email', 'last')
        # record_label=('record_label', 'first')
    )
    .reset_index()
    .sort_values(by='track_artist')
)
display(df_artist)
print(df_artist.dtypes)


"""Songs {
    string artist_name PK "Partition Key | ID del artista | Nombre o email"
    string song_title "Sort Key | Titulo de la cancion"
    string album_name "Nombre del album"
    number duration "Duración en segundos"
    # number numero_reproducciones "Numero de reproducciones"
    number max_popularity "Maxima popularidad de una cancion"
    number popularity "Índice de popularidad"
    string GSI "GSI: album_name | Para busquedas por canciones de artista y album"
    string LSI1 "LSI1: max_popularity | Para las playlist: This is <artista> . Tomar las de maxima_popularidad historica"
}
"""

df_songs = (
    df[['track_artist', 'track_name', 
        'track_album_name', 'track_popularity', 'duration']]
    .rename(columns={
        'track_artist': 'artist_name',
        'track_name': 'song_title',
        'track_album_name': 'album_name',
        'track_popularity': 'popularity',
        'duration': 'duration'
    })
    .sort_values(by='album_name', ascending=False)
)
display(df_songs)

df_songs['rank'] = df_songs.groupby('album_name')['popularity'].rank(method='dense', ascending=False).astype(int)
df_songs['factor'] = 1 + (1 / (df_songs['rank'] + 1))
df_songs['max_popularity'] = (df_songs['popularity'] * df_songs['factor']).astype(int)
df_songs = df_songs.sort_values(by=['album_name', 'rank'])
display(df_songs)


"""Users {
    string email PK "Partition Key | Email del usuario"
    string user_name "Sort Key | Profile name"
    string name "Nombre completo"
    number edad "Edad del usuario"
    string password "Contraseña hasheada"
    timestamp created_at "Fecha de creación"
    string GSI1 "GSI1: edad | Para análisis demográfico"
    string GSI2 "GSI2: created_at | Para búsquedas por fecha de creación"
}
"""

users_dataset_path = kagglehub.dataset_download("arindamsahoo/social-media-users")

df_users = (
    pd.read_csv(os.path.join(users_dataset_path, "SocialMediaUsersDataset.csv"))
    .sample(10000)
    .rename(columns={
        'DOB': 'birth_date',
        'Country': 'country',
        'City': 'city',
    })
)
df_users['user_name'] = df_users['Name'].apply(lambda x: '_'.join(x.lower().split()))  
df_users['email'] = df_users['user_name'].apply(lambda x: f"{x}@gmail.com")
df_users['age'] = (pd.to_datetime('today') - pd.to_datetime(df_users['birth_date'])).dt.days // 365
df_users['created_at'] = pd.to_datetime(df_users['birth_date']) + pd.to_timedelta(np.random.randint(15*365, 18*365, size=len(df_users)), unit='D')
df_users.columns = [col.lower() for col in df_users.columns]
df_users['password'] = '1234'
df_users = df_users[['email', 'user_name', 'name', 'age', 'password', 'created_at', 'country', 'city']]
display(df_users)
# df_users['bcrypt_password'] = df_users['password'].apply(lambda x: bcrypt.hashpw(x.encode(), bcrypt.gensalt()).decode())

"""Playlists {
    string user_email PK "Partition Key | Users.email"
    string playlist_name "Sort Key | Nombre de la playlist"
    string descripcion "Descripcion de la playlist"
    number songs_number "Numero de canciones"
    number total_time "Tiempo aproximado de duracion"
    # bool public "Si la playlist es publica o privada"
    string wallpaper_s3 "S3 wallpaper path"
    timestamp created_at "Fecha de creación"
    number LSI1  "Indice de popularidad"
}
"""

def generate_playlists(df_users, n_playlists=15000):
    user_emails = df_users['email'].tolist()
    
    base_playlists = pd.DataFrame({
        'user_email': user_emails,
        'playlist_name': [f"Liked Songs" for _ in range(len(user_emails))]
    })
    
    try:
        additional_playlists = pd.DataFrame({
            'user_email': np.random.choice(user_emails, n_playlists - len(user_emails)),
            'playlist_name': [f"My Playlist {uuid.uuid4().hex[:8]}" for _ in range(n_playlists - len(user_emails))]
        })
    except:
        additional_playlists = pd.DataFrame()
    
    df_playlists = pd.concat([base_playlists, additional_playlists])
    
    df_playlists['descripcion'] = [
        random.choice([
            "My favorite songs",
            "Perfect for working",
            "Workout mix",
            "Chill vibes",
            "Party time!",
            "Road trip music",
            "Study session",
            "Weekend mood"
        ]) for _ in range(len(df_playlists))
    ]
    
    df_playlists['songs_number'] = np.random.randint(5, 100, size=len(df_playlists))
    # df_playlists['total_time'] = -1
    df_playlists['wallpaper_s3'] = [f"s3://playlists/{uuid.uuid4().hex}.jpg" for _ in range(len(df_playlists))]
    # df_playlists['created_at'] = np.nan
    df_playlists['likes'] = np.random.randint(0, 1000, size=len(df_playlists))
    return df_playlists

df_playlists = (
    generate_playlists(df_users, 10000)
    .merge(df_users[['email', 'created_at']].rename(columns={'email': 'user_email'}), on='user_email')
)
df_playlists['created_at'] = df_playlists['created_at'] + pd.to_timedelta(np.random.randint(0, 365, size=len(df_playlists)), unit='D')
display(df_playlists)


"""
Albums {
    string artist_name PK "Partition Key | ID del artista | Nombre o email"
    string album_title "Sort Key | Titulo del album"
    string release_date "Fecha de lanzamiento"
}
"""
df_albums = (
    df[['track_artist', 'track_album_name', 'track_album_release_date', 'track_id', 'duration', 'track_popularity']]
    .rename(columns={
        'track_artist': 'artist_name',
        'track_album_name': 'album_title',
        'track_album_release_date': 'created_at',
        'track_id': 'songs_number',
        'duration': 'duration',
        'track_popularity': 'album_popularity'
    })
    .groupby(['artist_name', 'album_title'], as_index=False)
    .agg({
        'songs_number': 'count',
        'duration': 'sum',
        'album_popularity': 'mean',
    })
)
df_albums['wallpaper_s3'] = [f"s3://bucket/{uuid.uuid4().hex}.jpg" for _ in range(len(df_albums))]
display(df_albums)


"""
PlaylistSongs {
    string playlist_name PK "Partition Key | Nombre de la playlist"
    string song_title "Sort Key | Nombre de la cancion"
    number position "Posición en la playlist"
    timestamp added_at "Fecha de agregación"
}
"""
def generate_playlist_songs(df_playlists, df_songs, min_songs_per_playlist=3):
    playlist_songs_data = []
    
    for _, playlist in tqdm(df_playlists.iterrows(), total=len(df_playlists)):
        n_songs = random.randint(min_songs_per_playlist, min(30, playlist['songs_number']))
        n_songs = playlist['songs_number'] if n_songs > playlist['songs_number'] else n_songs

        selected_songs = df_songs.sample(n=n_songs)
        
        for pos, (_, song) in enumerate(selected_songs.iterrows(), 1):
            # Generar fecha de agregación posterior a la creación de la playlist
            days_after_creation = random.randint(0, 365)
            added_at = playlist['created_at'] + timedelta(days=days_after_creation)
            
            playlist_songs_data.append({
                'playlist_name': f"{playlist['user_email']}#{playlist['playlist_name']}",
                'song_title': f"{song['song_title']}",
                'artist_name': song['artist_name'],
                'song_duration': song['duration'],
                'position': pos,
                'added_at': added_at
            })
    
    return pd.DataFrame(playlist_songs_data)

df_playlist_songs = generate_playlist_songs(df_playlists, df_songs)
display(df_playlist_songs)


df_playlists['playlist_id'] = df_playlists.apply(lambda df: f"{df['user_email']}#{df['playlist_name']}", axis=1)
df_playlists['total_time'] = df_playlists.merge(
    df_playlist_songs.groupby('playlist_name', as_index=False)['song_duration'].sum(), 
    left_on='playlist_id', right_on='playlist_name', how='left'
).rename(columns={'song_duration': 'total_time'})['total_time']
df_playlists = df_playlists.drop(columns=['playlist_id'])

"""
UserReplays {
    string email PK "Partition Key | Email del usuario"
    string song_id "Sort Key | ID de la canción (ID del artista + título de la canción)"
    timestamp replayed_at "Fecha y hora de la reproducción"
    number replay_duration "Duración de la reproducción en segundos"
    string GSI1 "GSI1: replayed_at | Para buscar reproducciones por fecha"
    string GSI2 "GSI2: song_id | Para buscar reproducciones por canción"
}
"""
def generate_user_replays(df_users, df_songs, n_replays=10000):
    user_replays_data = []
    
    # Para cada usuario
    for idx, user in tqdm(df_users.iterrows(), total=len(df_users)):
        try:
            # Generar un número aleatorio de reproducciones
            n_user_replays = random.randint(10, 100)
            
            # Seleccionar canciones aleatorias para el usuario
            user_songs = df_songs.sample(n=min(n_user_replays, len(df_songs)), replace=True)
            
            for _, song in user_songs.iterrows():
                # Generar múltiples reproducciones por canción
                n_song_replays = random.randint(1, 5)
                
                for _ in range(n_song_replays):
                    # Ensure created_at is a datetime object
                    if isinstance(user['created_at'], pd.Timestamp):
                        created_at = user['created_at'].to_pydatetime()
                    else:
                        created_at = user['created_at']
                    
                    # Calculate days between creation and now
                    days_diff = (datetime.now() - created_at).days
                    if days_diff <= 0:
                        continue
                        
                    # Calculate replay date
                    days_after_creation = random.randint(0, days_diff)
                    hours_after_creation = random.randint(0, 23)
                    minutes_after_creation = random.randint(0, 59)
                    seconds_after_creation = random.randint(0, 59)

                    replayed_at = created_at + timedelta(
                        days=days_after_creation,
                        hours=hours_after_creation,
                        minutes=minutes_after_creation,
                        seconds=seconds_after_creation
                    )
                    
                    # Calcular duración de reproducción (entre 30% y 100% de la duración total)
                    replay_duration = int(song['duration'] * random.uniform(0.3, 1.0))
                    
                    user_replays_data.append({
                        'email': user['email'],
                        'user_email': user['email'],  # Adding this for consistency
                        'song_id': f"{song['artist_name']}#{song['song_title']}",
                        'song_title': song['song_title'],  # Adding this for the table schema
                        'replayed_at': replayed_at,
                        'replay_duration': replay_duration
                    })
                    
                    # Break if we've reached our target
                    if len(user_replays_data) >= n_replays:
                        break
                        
                if len(user_replays_data) >= n_replays:
                    break
                    
            if len(user_replays_data) >= n_replays:
                break
                
        except Exception as e:
            print(f"Error processing user {idx}: {str(e)}")
            continue
    
    df_user_replays = pd.DataFrame(user_replays_data)
    
    # Ordenar por fecha de reproducción
    df_user_replays = df_user_replays.sort_values('replayed_at')
    
    # Limitar al número deseado de reproducciones
    return df_user_replays.head(n_replays)

df_user_replays = generate_user_replays(df_users, df_songs)

"""
Artists ||--o{ Songs : "creates"
Artists ||--o{ Albums : "releases"
Albums ||--o{ Songs : "contains"
Users ||--o{ Playlists : "creates"
Playlists ||--o{ PlaylistSongs : "contains"
Songs ||--o{ PlaylistSongs : "appears_in"
Users ||--o{ UserReplays : "replays"
Songs ||--o{ UserReplays : "is_played_in"
"""

display(df_artist)
display(df_songs)
display(df_albums)

display(df_users)
display(df_playlists)
display(df_playlist_songs)
display(df_user_replays)

print(f"{df_artist.shape=}")
print(f"{df_songs.shape=}")
print(f"{df_albums.shape=}")

print(f"{df_users.shape=}")
print(f"{df_playlists.shape=}")
print(f"{df_playlist_songs.shape=}")
print(f"{df_user_replays.shape=}")

os.makedirs('data', exist_ok=True)
df_artist.to_parquet('data/artist.parquet', index=False)
df_songs.to_parquet('data/songs.parquet', index=False)
df_albums.to_parquet('data/albums.parquet', index=False)
df_users.to_parquet('data/users.parquet', index=False)
df_playlists.to_parquet('data/playlists.parquet', index=False)
df_playlist_songs.to_parquet('data/playlist_songs.parquet', index=False)
df_user_replays.to_parquet('data/user_replays.parquet', index=False)
