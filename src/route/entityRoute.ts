import {Router} from 'express';
import { getDataByEntity, getAllData } from '../controller/entityController';

const app = Router();

//get all the data
app.get('/', getAllData);

//get by entity.
app.get('/:entity', getDataByEntity);

export {
    app as entityRoute
}