import boto3
import pandas as pd
from tqdm import tqdm
import numpy as np
from botocore.exceptions import ClientError
import math

# Initialize DynamoDB client with region
dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'dev-fp-t_songs'

def convert_to_dynamodb_format(item):
    formatted_item = {}
    try:
        for key, value in item.items():
            if pd.isna(value):  # Skip NaN values
                continue
            if isinstance(value, str):
                formatted_item[key] = {'S': str(value)}
            elif isinstance(value, (int, float)):
                formatted_item[key] = {'N': str(float(value))}
            elif isinstance(value, (list, np.ndarray)):
                if len(value) > 0:
                    formatted_item[key] = {'S': str(value[0])}
            elif value is None:
                continue
    except Exception as e:
        print(f"Error converting item: {e}")
        print(f"Problematic item: {item}")
    return formatted_item

def batch_write_songs(items):
    try:
        request_items = {
            TABLE_NAME: [{'PutRequest': {'Item': convert_to_dynamodb_format(item)}} 
                        for item in items]
        }
        
        # Print first item for debugging
        print("\nFirst item in batch:")
        print(request_items[TABLE_NAME][0])
        
        response = dynamodb.batch_write_item(RequestItems=request_items)
        
        # Check for unprocessed items
        if 'UnprocessedItems' in response and response['UnprocessedItems']:
            print(f"Warning: {len(response['UnprocessedItems'][TABLE_NAME])} items were not processed")
        
        return True
    except ClientError as e:
        print(f"Error writing batch: {e}")
        print(f"First item in problematic batch: {items[0]}")
        return False
    except Exception as e:
        print(f"Error in batch_write_songs: {e}")
        return False

def prepare_songs_data(df):
    print("\nOriginal DataFrame columns:", df.columns.tolist())
    print("Original DataFrame shape:", df.shape)
    
    df = df.copy()
    
    columns_to_keep = ['artist_name', 'song_title', 'album_name', 'popularity', 'duration', 'max_popularity']
    df = df[columns_to_keep]
    
    df = df.drop_duplicates(subset=['artist_name', 'song_title'])
    
    df['duration'] = df['duration'].astype(float)
    df['popularity'] = df['popularity'].astype(float)
    df['max_popularity'] = df['max_popularity'].astype(float)
    
    df = df.dropna()
    
    print("\nPrepared DataFrame columns:", df.columns.tolist())
    print("Prepared DataFrame shape:", df.shape)
    print("\nSample row:")
    print(df.iloc[0].to_dict())
    
    return df

def verify_table_exists():
    try:
        response = dynamodb.describe_table(TableName=TABLE_NAME)
        table_status = response['Table']['TableStatus']
        print(f"\nTable status: {table_status}")
        return table_status == 'ACTIVE'
    except Exception as e:
        print(f"\nError verifying table: {e}")
        return False

def insert_songs():
    if not verify_table_exists():
        print("Table doesn't exist.")
        return
    
    try:
        print("\nLoading songs dataset")
        from dataset import df_songs
        
        print("\nPreparing songs data")
        df_songs_prepared = prepare_songs_data(df_songs)
        
        df_songs_prepared = df_songs_prepared.head(10000)
        
        records = df_songs_prepared.to_dict('records')
        
        print(f"\nTotal records to process: {len(records)}")
        
        successful_writes = 0
        with tqdm(total=len(records)) as pbar:
            for i in range(0, len(records), 25):
                batch = records[i:i + 25]
                if batch_write_songs(batch):
                    successful_writes += len(batch)
                pbar.update(len(batch))
        
        print(f"\nSuccessfully wrote {successful_writes} records")
        
        try:
            response = dynamodb.scan(
                TableName=TABLE_NAME,
                Limit=1
            )
            print(f"\nVerification scan found {response['Count']} items")
            if response['Count'] > 0:
                print("Sample item from table:")
                print(response['Items'][0])
        except Exception as e:
            print(f"Error verifying data: {e}")
                
    except Exception as e:
        print(f"\nError during songs insertion: {e}")

if __name__ == "__main__":
    print("Starting")
    insert_songs()
    print("\nSongs data insertion process completed!")