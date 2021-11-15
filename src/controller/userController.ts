import uuid from 'uuid';
import {dynamoDb} from '../model/dynamoDb'
import {Request, Response} from 'express';

const TABLENAME : any = process.env.TABLENAME;

const getUserById = async (req:Request, res:Response) => {
    const id = req.params.id;
    const params = {
        TableName: `${TABLENAME}`,
        Key: {
            PK: `USER#${id}`,
            SK: `USER`
        }
    };
    try{
        const  data = await dynamoDb.get(params).promise();
        res.send(data.Item);  
    } catch (error){
        console.log(error);
    }
}

const insertNewUser = async (req:Request, res:Response) => {
    const id = uuid.v4();
    const params = {
        TableName : `${TABLENAME}`,
        Item: {
            'PK' : `USER#${id}`,
            'SK' : `USER`,
            'name' : `${req.body.name}`,
            'email' : `${req.body.email}`,
            'phone' : `${req.body.phone}`,
            'id' : `${id}`
        }
    };

    try{
        const data = await dynamoDb.put(params).promise();
        if(data)
            return {
                'name' : `${req.body.name}`,
                'email' : `${req.body.email}`,
                'phone' : `${req.body.phone}`,
                'id' : `${id}`,
                'message' : 'New user successfully created.'
            };
    }catch (error) {
        console.log(error);
    }
}

const deleteUserById = async (req: Request, res:Response) => {
    const params = {
        TableName: `${TABLENAME}`,
        Key:{
            PK: `USER#${req.params.id}`,
            SK: `USER`
        },
        ReturnValues: 'ALL_OLD'
    };
    try {
        const data = await dynamoDb.delete(params).promise();
        res.send(data);  
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req:Request, res:Response) => {
    const params = {
        TableName: TABLENAME,
        Key:{
            PK: `USER#${req.params.id}`,
            SK: `USER`
        },
        UpdateExpression: "set #name = :name, phone = :phone, email = :email",
        ExpressionAttributeNames:{"#name":"name"},
        ExpressionAttributeValues:{
            ':name' : `${req.body.name}`,
            ':phone' : `${req.body.phone}`,
            ':email' : `${req.body.email}`
        },
        ReturnValues : 'UPDATED_NEW'
    };
    try {
        const data = await dynamoDb.update(params).promise();
        res.send(data.Attributes);
    } catch (error) {
        console.log(error);
    }
}

export {
    getUserById,
    insertNewUser,
    deleteUserById,
    updateUser
}