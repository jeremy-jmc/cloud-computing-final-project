import AWS from "aws-sdk";
AWS.config.update({ region: process.env.AWS_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const SONGS_TABLE = process.env.SONGS_TABLE;

export const handler = async (event) => {
    console.log('Event:', event);
    try {
        const songTitle = event.body?.title;
        
        if (!songTitle) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "El parámetro 'title' es requerido",
                    event: event
                })
            };
        }

        const params = {
            TableName: SONGS_TABLE,
            FilterExpression: "contains(song_title, :songTitle)",
            ExpressionAttributeValues: {
                ":songTitle": songTitle
            }
        };

        // TODO: Change SCAN to QUERY
        const result = await dynamodb.scan(params).promise();

        if (result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "No se encontraron canciones con ese título"
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                message: "Canciones encontradas",
                songs: result.Items,
                total: result.Items.length
            }
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error interno del servidor",
                errorDetail: error.message
            })
        };
    }
};