import boto3
import os
# import json
# import uuid
from datetime import datetime

# os.environ['AWS_REGION'] = 'us-east-1'
# os.environ['PLAYLIST_SONGS_TABLE'] = 'dev-fp-t_playlist_songs'

def lambda_handler(event, context):
    body = event['body']

    user_email = body['user_email']
    playlist_name = body['playlist_name']

    dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION'))
    table = dynamodb.Table(os.environ.get('PLAYLIST_SONGS_TABLE'))

    playlist_id = f'{user_email}#{playlist_name}'


    response = table.query(
        KeyConditionExpression='playlist_name = :playlist_name',
        ExpressionAttributeValues={
            ':playlist_name': playlist_id
        }
    )

    if all([k not in response for k in ['Items', 'Item']]):
        return {
            'statusCode': 403,
            'body': 'Usuario no tiene playlists'
        }
    
    return {
        'statusCode': 200,
        'body': response['Items']
    }


# lambda_handler({
#     'body': {
#         "user_email": "geraldine_austin@gmail.com",
#         "playlist_name": "Liked Songs"
#     }
# }, {})