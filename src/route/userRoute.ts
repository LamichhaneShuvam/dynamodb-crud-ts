import {Router} from 'express';
import { updateUser, deleteUserById, getUserById, insertNewUser } from '../controller/userController';

const app = Router();

//get user by id
app.get('/:id', getUserById);

//put the user
app.post('/', insertNewUser);

//delete user
app.delete('/:id', deleteUserById);

//update user
app.put('/:id', updateUser);

export {
    app as userRoute
}