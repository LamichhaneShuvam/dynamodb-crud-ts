import {dynamoDb} from '../model/dynamoDb';
import { Request, Response } from 'express';

const TABLENAME: any = process.env.TABLENAME;

const getAllData = async (req:Request ,res:Response) => {
    const params = {
        TableName: `${TABLENAME}`
    };
    try{
        const data = await dynamoDb.scan(params).promise();
        res.send(data.Items);
    }catch(error){
        console.log(error);
    }
}

const getDataByEntity = async (req:Request ,res:Response) => {
    const entity = req.params.entity.toUpperCase();
    const params = {
        TableName: `${TABLENAME}`,
        IndexName: 'main-index',
        KeyConditionExpression: "#SK = :SK and begins_with(#PK , :PK)",
        ExpressionAttributeNames: {
            "#PK": "PK",
            "#SK" : "SK"
        },
        ExpressionAttributeValues:{
            ":PK": `${entity}`,
            ":SK": `${entity}`
        }
    };
    try {
        const data = await dynamoDb.query(params).promise();
        res.send(data.Items);
    } catch (error) {
        console.log(error)
    }
    
}

export {
    getAllData,
    getDataByEntity
}