# https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset/code
# https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs?select=spotify_songs.csv
import kagglehub
import numpy as np
import os
import pandas as pd
from IPython.display import display
import uuid
pd.set_option('display.max_columns', None)


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


"""
Artists {
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
        email=('artist_email', 'last')
        # record_label=('record_label', 'first')
    )
    .reset_index()
    .sort_values(by='track_artist')
)
display(df_artist)
print(df_artist.dtypes)


"""
Songs {
    string artist_id PK "Partition Key | ID del artista | Nombre o email"
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
    df[['artist_email', 'track_name', 
        'track_album_name', 'track_popularity', 'duration']]
    .rename(columns={
        'artist_email': 'artist_id',
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


"""
Users {
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
display(df_users[['email', 'user_name', 'name', 'age', 'password', 'created_at', 'country', 'city']])
# df_users['bcrypt_password'] = df_users['password'].apply(lambda x: bcrypt.hashpw(x.encode(), bcrypt.gensalt()).decode())

"""
Playlists {
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
# TODO: first create user table, then playlists table


"""
Albums {
    string artist_id PK "Partition Key | ID del artista | Nombre o email"
    string album_title "Sort Key | Titulo del album"
    string release_date "Fecha de lanzamiento"
}
"""
df_albums = (
    df[['artist_email', 'track_album_name', 'track_album_release_date', 'track_id', 'duration', 'track_popularity']]
    .rename(columns={
        'artist_email': 'artist_email',
        'track_album_name': 'album_title',
        'track_album_release_date': 'created_at',
        'track_id': 'songs_number',
        'duration': 'duration',
        'track_popularity': 'album_popularity'
    })
    .groupby(['artist_email', 'album_title'], as_index=False)
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
    string song_name "Sort Key | Nombre de la cancion"
    number position "Posición en la playlist"
    timestamp added_at "Fecha de agregación"
}
"""
# TODO: Create playlist songs table


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
# TODO: Create user replays table


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
