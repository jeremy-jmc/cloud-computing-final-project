import boto3
# import boto3.resources
# import boto3.resources.factory
import numpy as np
import pandas as pd
from tqdm import tqdm
import time
from decimal import Decimal

stage = 'dev'

tables = {
    f'{stage}-fp-t_albums': pd.read_parquet('./data/albums.parquet').rename(columns={'album_title': 'album_name'}),
    f'{stage}-fp-t_artists': pd.read_parquet('./data/artist.parquet').assign(
        created_at=lambda x: x['created_at'].astype(str),
        genres=lambda x: x['genres'].apply(lambda x: str(x.tolist()))
    ).rename(columns={'track_artist': 'artist_name'}),
    f'{stage}-fp-t_playlist_songs': pd.read_parquet('./data/playlist_songs.parquet').assign(
        added_at=lambda x: x['added_at'].astype(str)
    ).drop_duplicates(subset=['playlist_name','song_title'], keep='first'),
    f'{stage}-fp-t_playlists': pd.read_parquet('./data/playlists.parquet').assign(
        created_at=lambda x: x['created_at'].astype(str)
    ).drop_duplicates(subset=['user_email', 'playlist_name'], keep='first'),
    f'{stage}-fp-t_songs': pd.read_parquet('./data/songs.parquet').drop_duplicates(
        subset=['artist_name', 'song_title'], keep='first'
    ),
    f'{stage}-fp-t_user_replays': pd.read_parquet('./data/user_replays.parquet').assign(
        replayed_at=lambda x: x['replayed_at'].astype(str)
    ).drop_duplicates(
        subset=['user_email', 'song_title']
    ),
    f'{stage}-fp-t_users': pd.read_parquet('./data/users.parquet').assign(
        created_at=lambda x: x['created_at'].astype(str)
    ).drop_duplicates(
        subset=['email', 'user_name'], keep='first'
    ),
}

# print(tables.keys())

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
print(type(dynamodb))
# boto3.resources.factory.dynamodb.ServiceResource
# boto3.resources.factory.dynamodb.Table

for table_name, df in tables.items():
    print(f'Inserting data into {table_name}')
    
    table = dynamodb.Table(table_name)
    print(type(table))
    with table.batch_writer() as batch:
        for i, row in tqdm(df.iterrows(), total=df.shape[0]):
            item = {
                k: (Decimal(str(v)) if isinstance(v, float) else v.tolist() if isinstance(v, np.ndarray) else v) 
                for k, v in row.to_dict().items()
            }
            
            # print(item)
            try:
                batch.put_item(Item=item)
            except Exception as e:
                print(f'Error inserting row {i} into {table_name}')
                print(e)
                break
    print(f'Data inserted into {table_name}')

"""
https://stackoverflow.com/questions/72007977/batchputitem-vs-putitem-in-dynamodb
"""