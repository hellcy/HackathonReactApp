/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DIGITALTOASTMASTERTABLES_ARN
	STORAGE_DIGITALTOASTMASTERTABLES_NAME
	STORAGE_DIGITALTOASTMASTERTABLES_STREAMARN
Amplify Params - DO NOT EDIT */

// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//     //  Uncomment below to enable CORS requests
//     //  headers: {
//     //      "Access-Control-Allow-Origin": "*",
//     //      "Access-Control-Allow-Headers": "*"
//     //  },
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function getItem(queryStringParameters) {
  console.log(queryStringParameters)
  try {
    const params = {
      TableName: 'powerpuff-dev-sentiment',
      /* Item properties will depend on your application concerns */
      Key: {
        'file-id': queryStringParameters.fileid,
      },
    }
    console.log(params)
    const data = await docClient.get(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  try {
    console.log(event.queryStringParameters)
    const data = await getItem(event.queryStringParameters)
    return {
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Origin': '*',
      },
    }
  } catch (err) {
    return { error: err }
  }
}
