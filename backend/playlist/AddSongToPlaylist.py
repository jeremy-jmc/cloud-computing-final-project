import boto3
import os
import json

# os.environ['AWS_REGION'] = 'us-east-1'
# os.environ['PLAYLIST_SONGS_TABLE'] = 'dev-fp-t_playlist_songs'

def lambda_handler(event, context):
    body = event['body']
    playlist_name = body.get('playlist_name')
    song_title = body.get('song_title')

    # Validación de parámetros
    if not playlist_name or not song_title:
        return {
            'statusCode': 400,
            'body': 'Faltan parámetros requeridos (playlist_name, song_title)'
        }

    # Conexión a DynamoDB
    dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION'))
    table = dynamodb.Table(os.environ.get('PLAYLIST_SONGS_TABLE'))

    # Agregar canción a la tabla PlaylistSongs
    new_song_entry = {
        'playlist_name': playlist_name,
        'song_title': song_title
    }
    table.put_item(Item=new_song_entry)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Canción agregada a la playlist'})
    }

# lambda_handler({
#     'body': {
#         'playlist_name': 'geraldine_austin@gmail.com#Rock80s',
#         'song_title': 'Bohemian Rhapsody'
#     }
# }, {})