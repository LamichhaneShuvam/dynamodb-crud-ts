import {Request , Response} from 'express';
import uuid from 'uuid';
import { dynamoDb } from '../model/dynamoDb';

const TABLENAME : any = process.env.TABLENAME;

const insertNewProduct = async (req:Request, res:Response) => {
    const id = uuid.v4();
    const params = {
        TransactItems: [
            {
                Update: {
                    TableName: TABLENAME,
                    Key:{
                        PK: `PRODUCT#${id}`,
                        SK: `PRODUCT`
                    },
                    UpdateExpression: "set #color = :color, #price = :price, #name = :name, #description = :description, #id = :id",
                    ExpressionAttributeNames:{
                        "#color": "color",
                        "#price": "price",
                        "#name":"name",
                        "#description": "description",
                        "#id": "id",
                    },
                    ExpressionAttributeValues:{
                        ':color' : `${req.body.color}`,
                        ':price' : `${req.body.price}`,
                        ':name' : `${req.body.name}`,
                        ':description' : `${req.body.description}`,
                        ':id' : `${id}`
                    }
                }
            },
            {
                Update: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `STAT#PRODUCT`,
                        SK: `STAT`
                    },
                    UpdateExpression:"set #count = #count + :p",
                    ExpressionAttributeNames: {
                        "#count" : "count"
                    },
                    ExpressionAttributeValues: {
                        ':p' : 1
                    }
                }
            }
        ] as any
    };
    try{
        const data = await dynamoDb.transactWrite(params).promise();
        if(data)
            res.send("Product created successfully");    
    }catch (error) {
        console.log(error);
    }
}

const getProductById = async (req:Request, res:Response) =>{
    const params = {
        TableName: `${TABLENAME}`,
        Key: {
            PK: `PRODUCT#${req.params.id}`,
            SK: `PRODUCT`
        }
    };
    try{
        const  data = await dynamoDb.get(params).promise();
        res.send(data.Item);    
    } catch (error){
        console.log(error);
    }
}

const deleteProductById = async (req:Request ,res:Response) => {
    const params = {
        TransactItems: [
            {
               Delete: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `PRODUCT#${req.params.id}`,
                        SK: `PRODUCT`
                    }
                }
            },
            {
                Update: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `STAT#PRODUCT`,
                        SK: `STAT`
                    },
                    UpdateExpression:"set #count = #count - :p",
                    ExpressionAttributeNames: {
                        "#count" : "count"
                    },
                    ExpressionAttributeValues: {
                        ':p' : 1
                    }
                }
            }
        ] as any
    };
    try {
        const data = await dynamoDb.transactWrite(params).promise();
        res.send(data);    
    } catch (error) {
        console.log(error);
    }
}

const updateProductById = async(req:Request, res:Response)=>{
    const params = {
        TableName: TABLENAME,
        Key:{
            PK: `PRODUCT#${req.params.id}`,
            SK: `PRODUCT`
        },
        UpdateExpression: "set color = :color, price = :price, #name = :name, description = :description",
        ExpressionAttributeNames:{"#name":"name"},
        ExpressionAttributeValues:{
            ':color' : `${req.body.color}`,
            ':price' : `${req.body.price}`,
            ':name' : `${req.body.name}`,
            ':description' : `${req.body.description}`
        },
        ReturnValues : 'UPDATED_NEW'
    };
    try {
        const data = await dynamoDb.update(params).promise();
        res.send(data.Attributes);
    } catch (error) {
        res.send(error);
    }
}

export {
    insertNewProduct,
    getProductById,
    deleteProductById,
    updateProductById
}