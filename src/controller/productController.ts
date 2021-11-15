import {Request , Response} from 'express';
import uuid from 'uuid';
import { dynamoDb } from '../model/dynamoDb';

const TABLENAME : any = process.env.TABLENAME;

const insertNewProduct = async (req:Request, res:Response) => {
    const id = uuid.v4();
    const params = {
        TableName : `${TABLENAME}`,
        Item: {
            'PK' : `PRODUCT#${id}`,
            'SK' : `PRODUCT`,
            'name' : `${req.body.name}`,
            'description' : `${req.body.description}`,
            'price' : `${req.body.price}`,
            'color' : `${req.body.color}`,
            'id' : `${id}`
        }
    };
    try{
        const data = await dynamoDb.put(params).promise();
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
        TableName: `${TABLENAME}`,
        Key:{
            PK: `PRODUCT#${req.params.id}`,
            SK: `PRODUCT`
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