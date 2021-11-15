import express from 'express';
require('dotenv').config({path:__dirname+'/.env'}); //ok need to do this in the app.js or index.js file
const port = process.env.PORT || 3000;

//importing routes
import { userRoute } from './route/userRoute';
import { productRoute } from './route/productRoute';
import { entityRoute } from './route/entityRoute';

const app = express();
app.use(express.json());

//setting up route
app.use('/user',userRoute);
app.use('/product',productRoute);
app.use('/entity',entityRoute);

//starting the server
app.listen(port, ()=>console.log(`started on port ${port}`));