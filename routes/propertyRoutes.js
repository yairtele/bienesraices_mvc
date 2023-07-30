import express from 'express';
import {admin, create} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/my_properties', admin);
router.get('/property/create', create);

export default router;