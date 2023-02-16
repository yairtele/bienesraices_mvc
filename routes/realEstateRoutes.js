import express from 'express';
import {admin} from '../controllers/realEstateController.js';

const router = express.Router();

router.get('/my_real_estate', admin);

export default router;