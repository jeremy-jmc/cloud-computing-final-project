import boto3
import pandas as pd
from tqdm import tqdm
import json
from datetime import datetime
import uuid
import numpy as np
from concurrent.futures import ThreadPoolExecutor
import math
from botocore.exceptions import ClientError

dynamodb = boto3.client('dynamodb', region_name='us-east-1')

def serialize_datetime(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def convert_to_dynamodb_format(item):
    formatted_item = {}
    for key, value in item.items():
        if isinstance(value, str):
            formatted_item[key] = {'S': value}
        elif isinstance(value, (int, float)):
            formatted_item[key] = {'N': str(value)}
        elif isinstance(value, datetime):
            formatted_item[key] = {'S': value.isoformat()}
        elif isinstance(value, (list, np.ndarray)):
            if len(value) > 0:
                if isinstance(value[0], str):
                    formatted_item[key] = {'S': str(value[0])}
                elif isinstance(value[0], (int, float)):
                    formatted_item[key] = {'N': str(value[0])}
        elif isinstance(value, bool):
            formatted_item[key] = {'BOOL': value}
        elif value is None:
            continue  # Skip None values
    return formatted_item

def prepare_dataframes():
    from dataset import (df_artist, df_songs, df_albums, 
                        df_users, df_playlists, df_playlist_songs, 
                        df_user_replays)
    
    # Fix Artists table - ensure unique keys
    df_artist_fixed = df_artist.copy()
    df_artist_fixed = df_artist_fixed.drop_duplicates(subset=['artist_name'])
    
    # Fix Songs table - ensure unique artist_name + song_title
    df_songs_fixed = df_songs.copy()
    df_songs_fixed = df_songs_fixed.drop_duplicates(subset=['artist_name', 'song_title'])
    
    # Fix Albums table - ensure it matches schema and has unique keys
    df_albums_fixed = df_albums.copy()
    df_albums_fixed = df_albums_fixed.drop_duplicates(subset=['artist_name', 'album_name'])
    df_albums_fixed = df_albums_fixed.rename(columns={'album_title': 'album_name'})
    
    # Fix Users table - ensure unique email + user_name
    df_users_fixed = df_users.copy()
    df_users_fixed = df_users_fixed.drop_duplicates(subset=['email', 'user_name'])
    
    # Fix Playlists table - ensure unique user_email + playlist_name
    df_playlists_fixed = df_playlists.copy()
    df_playlists_fixed = df_playlists_fixed.drop_duplicates(subset=['user_email', 'playlist_name'])
    
    # Fix PlaylistSongs table - ensure unique playlist_name + song_title
    df_playlist_songs_fixed = df_playlist_songs.copy()
    df_playlist_songs_fixed = df_playlist_songs_fixed.drop_duplicates(subset=['playlist_name', 'song_title'])
    
    # Fix UserReplays table - ensure unique user_email + song_title
    df_user_replays_fixed = df_user_replays.copy()
    df_user_replays_fixed = df_user_replays_fixed.rename(columns={'email': 'user_email'})
    df_user_replays_fixed = df_user_replays_fixed.drop_duplicates(subset=['user_email', 'song_title'])
    
    return {
        'dev-fp-t_artists': df_artist_fixed,
        'dev-fp-t_songs': df_songs_fixed,
        'dev-fp-t_albums': df_albums_fixed,
        'dev-fp-t_users': df_users_fixed,
        'dev-fp-t_playlists': df_playlists_fixed,
        'dev-fp-t_playlist_songs': df_playlist_songs_fixed,
        'dev-fp-t_user_replays': df_user_replays_fixed
    }

def batch_write_items(table_name, items):
    try:
        for i in range(0, len(items), 25):
            batch = items[i:i + 25]
            request_items = {
                table_name: [{'PutRequest': {'Item': convert_to_dynamodb_format(item)}} 
                           for item in batch]
            }
            
            try:
                response = dynamodb.batch_write_item(RequestItems=request_items)
                if 'UnprocessedItems' in response and response['UnprocessedItems']:
                    print(f"Warning: Some items were not processed for {table_name}")
            except ClientError as e:
                print(f"Error writing batch: {e}")
                print(f"First item in problematic batch: {batch[0]}")
                continue
    except Exception as e:
        print(f"Error in batch_write_items: {e}")

def insert_data():
    print("Loading and preparing dataset...")
    tables = prepare_dataframes()
    
    for table_name, df in tables.items():
        print(f"\nProcessing table: {table_name}")
        print(f"Number of records: {len(df)}")
        
        df = df.head(10000)
        
        records = df.to_dict('records')
        
        batch_size = 100
        num_batches = math.ceil(len(records) / batch_size)
        
        with tqdm(total=len(records)) as pbar:
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                batch_write_items(table_name, batch)
                pbar.update(len(batch))

if __name__ == "__main__":
    print("Starting...")
    insert_data()
    print("Data insertion completed!")