import {Router} from 'express';
import { getProductById,deleteProductById,insertNewProduct,updateProductById } from '../controller/productController';

const app = Router();

//get user by id
app.get('/:id', getProductById);

//put the user
app.post('/', insertNewProduct);

//delete user
app.delete('/:id', deleteProductById);

//update user
app.put('/:id', updateProductById);

export {
    app as productRoute
}