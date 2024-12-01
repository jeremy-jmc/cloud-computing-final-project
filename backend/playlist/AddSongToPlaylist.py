import boto3
import os
import json

os.environ['AWS_REGION'] = 'us-east-1'
os.environ['PLAYLIST_SONGS_TABLE'] = 'dev-fp-t_playlist_songs'
os.environ['PLAYLIST_TABLE'] = 'dev-fp-t_playlists'
os.environ['SONGS_TABLE'] = 'dev-fp-t_songs'

def lambda_handler(event, context):
    body = event['body']
    playlist_name = body.get('playlist_name', '')
    song_title = body.get('song_title', '')
    artist_name = body.get('artist_name', '')

    # Validación de parámetros
    if not playlist_name or not song_title or not artist_name:
        return {
            'statusCode': 400,
            'body': 'Faltan parámetros requeridos (playlist_name, song_title, artist_name)'
        }

    # Conexión a DynamoDB
    dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION'))
    playlist_songs_table = dynamodb.Table(os.environ.get('PLAYLIST_SONGS_TABLE'))
    playlist_table = dynamodb.Table(os.environ.get('PLAYLIST_TABLE'))
    songs_table = dynamodb.Table(os.environ.get('SONGS_TABLE'))

    # Agregar canción a la tabla PlaylistSongs
    new_song_entry = {
        'playlist_name': playlist_name,
        'artist_name': artist_name,
        'song_title': song_title
    }
    song_response = songs_table.get_item(Key={'artist_name': artist_name, 'song_title': song_title})
    new_song_entry['song_duration'] = song_response['Item']['duration']
    new_song_entry['album_name'] = song_response['Item']['album_name']


    playlist_songs_table.put_item(Item=new_song_entry)

    user_email, playlist_name_only = playlist_name.split('#')
    playlist_table.update_item(
        Key={'user_email': user_email, 'playlist_name': playlist_name_only},
        UpdateExpression='SET songs_number = if_not_exists(songs_number, :start) + :val',
        ExpressionAttributeValues={':val': 1, ':start': 0}
    )

    return {
        'statusCode': 200,
        'body': {'message': 'Canción agregada a la playlist'}
    }

# lambda_handler({
#     'body': {
#         'playlist_name': 'geraldine_austin@gmail.com#Rock80s',
#         'song_title': 'Bohemian Rhapsody',
#         'artist_name': 'Queen'
#     }
# }, {})