import AWS from "aws-sdk";
AWS.config.update({ region: process.env.AWS_REGION });

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TABLE_NAME = process.env.ARTIST_TABLE;

export const handler = async (event) => {
    let json_request;
    try {
        json_request = event.body;
    } catch (error) {
        return {
            statusCode: 400,
            body: {
                message: "El cuerpo de la solicitud debe ser un JSON válido.",
                error: error.message
            }
        };
    }

    if (!json_request.artist_name) {
        return {
            statusCode: 400,
            body: {
                message: "'artist_name' es obligatorio para realizar la consulta."
            }
        };
    }

    var params = {
        TableName: TABLE_NAME,
        FilterExpression: "begins_with(artist_name, :artist_name)",
        ExpressionAttributeValues: {
            ":artist_name": { S: json_request.artist_name }
        }
    };

    try {
        const data = await ddb.scan(params).promise();

        const plainItems = data.Items.map(AWS.DynamoDB.Converter.unmarshall);
        plainItems.sort((a, b) => b.popularity - a.popularity);


        return {
            statusCode: 200,
            body: plainItems.slice(0, 10)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: {
                message: "Error al consultar DynamoDB",
                error: err.message
            }
        };
    }
};
