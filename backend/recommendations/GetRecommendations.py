# import boto3
# import os
# import json

# STAGE = 'dev'
# os.environ['AWS_REGION'] = 'us-east-1'
# os.environ['SONGS_TABLE'] = f'{STAGE}-fp-t_songs'
# os.environ['USER_REPLAYS_TABLE'] = f'{STAGE}--fp-t_user_replays'


# def lambda_handler(event, context):
#     pass


# lambda_handler({
#     'body': {
#         'user_id': 'geraldine_austin@gmail.com'
#     }
# })

import boto3
import os
import json
from operator import itemgetter

# STAGE = 'prod'
# os.environ['AWS_REGION'] = 'us-east-1'
# os.environ['SONGS_TABLE'] = f'{STAGE}-fp-t_songs'
# os.environ['USER_REPLAYS_TABLE'] = f'{STAGE}-fp-t_user_replays'

dynamodb = boto3.resource('dynamodb', region_name=os.environ['AWS_REGION'])
user_replays_table = dynamodb.Table(os.environ['USER_REPLAYS_TABLE'])
songs_table = dynamodb.Table(os.environ['SONGS_TABLE'])


def get_user_replays(user_email):
    """Obtiene las últimas 50 canciones reproducidas por el usuario ordenadas por replayed_at."""
    response = user_replays_table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('user_email').eq(user_email),
        IndexName='LSI-replayed_at',
        ScanIndexForward=False,  # Orden descendente
        Limit=50  # Máximo 50 elementos
    )
    return response.get('Items', [])


def get_song_details(song_titles):
    """Obtiene los detalles de las canciones desde la tabla de canciones."""
    details = []
    for tup in song_titles:
        author, title = tup[0], tup[1]
        response = songs_table.get_item(Key={'artist_name': author, 'song_title': title})
        if 'Item' in response:
            details.append(response['Item'])
    return details


def lambda_handler(event, context):
    body = event.get('body', '{}')
    user_email = body.get('user_id')

    if not user_email:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "User email is required"})
        }
    
    user_replays = get_user_replays(user_email)
    if not user_replays:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No replays found for this user"})
        }
    
    song_author_title = [replay['song_id'].split('#') for replay in user_replays]

    
    song_details = get_song_details(song_author_title)
    
    replay_data = []
    for replay in user_replays:
        author, title = replay['song_id'].split('#')
        song_detail = next((song for song in song_details if song['song_title'] == title and song['artist_name'] == author), None)
        
        if song_detail:
            total_minutes = replay['replay_duration'] / 60  # Convertir duración a minutos
            replay_data.append({
                "song_title": replay['song_title'],
                "artist_name": author,
                "total_minutes": float(total_minutes)
            })
    
    top_10_songs = sorted(replay_data, key=itemgetter('total_minutes'), reverse=True)[:10]
    
    return {
        "statusCode": 200,
        # "user_replays": user_replays,
        # "song_details": song_details,
        "body": top_10_songs
    }


# response = lambda_handler({
#     'body': {
#         'user_id': 'linda_choate@gmail.com'
#     }
# }, {})