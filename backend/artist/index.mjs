import AWS from "aws-sdk";
AWS.config.update({ region: process.env.AWS_REGION });

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

var params = {
    RequestItems: {
        [process.env.ARTIST_TABLE]: {
            Keys: [
                
            ]
        }
    }
};

export const handler = async (event) => {
    // TODO implement
    let artist_colnames = ['artist_name', 'genres', 'subgenres', 'popularity', 'created_at'];
    let artist_colname_types = ['S', 'S', 'L', 'N', 'S'];
    artist_colnames.forEach((colname, index) => {
        const col_type = artist_colname_types[index];

        if (event.hasOwnProperty(colname)) {
            if (col_type == 'L') {
                params.RequestItems[process.env.ARTIST_TABLE].Keys.push({
                    [colname]: { L: event[colname].split(',') }
                })
            } else if (col_type == 'N') {
                params.RequestItems[process.env.ARTIST_TABLE].Keys.push({
                    [colname]: { N: event[colname] }
                })
            } else if (col_type == 'S') {
                params.RequestItems[process.env.ARTIST_TABLE].Keys.push({
                    [colname]: { S: event[colname] }
                })
            }
        }
    });

    // let response_records = [];
    let data = await ddb.batchGetItem(params).promise(); 
    // data.Responses[process.env.ARTIST_TABLE].forEach(function (element, index, array) {
    //     response_records.push(element);
    // });

    const response_records = data.Responses[process.env.ARTIST_TABLE].map(item => AWS.DynamoDB.Converter.unmarshall(item));

    // ddb.batchGetItem(params, function (err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     } else {
    //         data.Responses[process.env.ARTIST_TABLE].forEach(function (element, index, array) {
    //             response_records.push(element);
    //         });
    //     }
    // });

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


