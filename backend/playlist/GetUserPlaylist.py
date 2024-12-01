import boto3
import os
# import json
# import uuid
from datetime import datetime

# os.environ['AWS_REGION'] = 'us-east-1'
# os.environ['PLAYLIST_TABLE'] = 'dev-fp-t_playlists'

def lambda_handler(event, context):
    body = event['body']

    user_email = body['user_email']

    dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION'))
    table = dynamodb.Table(os.environ.get('PLAYLIST_TABLE'))

    response = table.query(
        KeyConditionExpression='user_email = :user_email',
        ExpressionAttributeValues={
            ':user_email': user_email
        }
    )
    print(response)

    if all([k not in response for k in ['Items', 'Item']]):
        return {
            'statusCode': 403,
            'body': 'Usuario no tiene playlists'
        }
    else:
        return {
            'statusCode': 200,
            'body': response['Items']
        }



# lambda_handler({
#     'body': {
#         'user_email': 'geraldine_austin@gmail.com',
#     }
# }, {})