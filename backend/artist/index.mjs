import AWS from "aws-sdk";
AWS.config.update({ region: process.env.AWS_REGION });

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TABLE_NAME = process.env.ARTIST_TABLE;

/*
Although it seems that this endpoint allows you to search by any field, it can only do so by artist_name
*/

export const handler = async (event) => {
    var params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "",
        ExpressionAttributeValues: {
        }
    };
    let json_request = event.body;
    let artist_colnames = ['artist_name', 'genres', 'subgenres', 'popularity', 'created_at'];
    let artist_colname_types = ['S', 'S', 'L', 'N', 'S'];
    artist_colnames.forEach((colname, index) => {
        const col_type = artist_colname_types[index];

        if (json_request.hasOwnProperty(colname)) {
            params.KeyConditionExpression += `${colname} = :${colname} AND `;
            if (col_type == 'N') {
                params.ExpressionAttributeValues[`:${colname}`] = { N: json_request[colname] };
            } else if (col_type == 'S') {
                params.ExpressionAttributeValues[`:${colname}`] = { S: json_request[colname] };
            }
        }
    });
    params.KeyConditionExpression = params.KeyConditionExpression.slice(0, -5);

    let response_records = [];
    try {
        const data = await ddb.query(params).promise();
        response_records = data.Items;
    } catch (err) {
        return {
            statusCode: 500,
            body: {
                message: 'Error querying DynamoDB',
                error: err
            }
        }
    }

    const response = {
        statusCode: 200,
        body: {
            event: event,
            message: 'Hello from Lambda!',
            region: AWS.config.region,
            artistTable: process.env.ARTIST_TABLE,
            params: params,
            response: response_records
        }
    };
    return response;
};

// https://docs.aws.amazon.com/es_es/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write-batch.html
// TODO: https://stackoverflow.com/questions/31889891/validationexception-the-provided-key-element-does-not-match-the-schema

/**
 * Sample JSON request:
 * {
 *      "artist_name": "The Beatles"
 * }
 */