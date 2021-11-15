import {DynamoDB} from 'aws-sdk';

const connection = new DynamoDB.DocumentClient(
    { 
        endpoint: process.env.DYNAMOENDPOINT, 
        accessKeyId: process.env.ACCESSKEYID, 
        secretAccessKey: process.env.ACCESSSECRETEID, 
        region: process.env.REGION 
    }
);

export {
    connection as dynamoDb
}