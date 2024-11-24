import boto3
import os
import json
import uuid
from datetime import datetime

# os.environ['AWS_REGION'] = 'us-east-1'
# os.environ['PLAYLISTS_TABLE'] = 'dev-fp-t_playlists'

def lambda_handler(event, context):
    body = event['body']

    user_email = body['user_email']
    playlist_name = body['playlist_name']

    if not user_email or not playlist_name:
        return {
            'statusCode': 400,
            'body': 'Faltan parámetros requeridos (user_email, playlist_name)'
        }

    dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION'))
    table = dynamodb.Table(os.environ.get('PLAYLIST_TABLE'))

    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    new_playlist = {
        'user_email': user_email,
        'playlist_name': playlist_name,
        'created_at': now,
        'descripcion': '',
        'likes': 0,
        'songs_number': 0,
        'total_time': 0,
        'wallpaper_s3': f"s3://playlists/{uuid.uuid4().hex}.jpg"
    }

    table.put_item(Item=new_playlist)

    return {
        'statusCode': 201,
        'body': {
            'message': 'Playlist creada',
            'playlist': new_playlist
        }
    }


# lambda_handler({
#     'body': {
#         'user_email': 'geraldine_austin@gmail.com',
#         'playlist_name': 'Rock'
#     }
# }, {})