import AWS from "aws-sdk";
AWS.config.update({ region: process.env.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const ALBUMS_TABLE = process.env.ALBUMS_TABLE;

export const handler = async (event) => {
    const search = event.body?.search;
    // const album_name = event.body?.album_name;

    try {
        const queries = [];
        
        const artistQuery = dynamoDB.query({
            TableName: ALBUMS_TABLE,
            KeyConditionExpression: 'artist_name = :artist_name',
            ExpressionAttributeValues: {
                ':artist_name': search
            }
        }).promise();
        queries.push(artistQuery);
    
        const albumQuery = dynamoDB.scan({
            TableName: ALBUMS_TABLE,
            FilterExpression: 'contains(album_name, :album_name)',
            ExpressionAttributeValues: {
                ':album_name': search
            }
        }).promise();
        queries.push(albumQuery);

        const results = await Promise.all(queries);
        const combinedItems = results.flatMap(result => result.Items);

        return {
            statusCode: 200,
            body: combinedItems,
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al procesar la solicitud", error: error.message }),
        };
    }
};
