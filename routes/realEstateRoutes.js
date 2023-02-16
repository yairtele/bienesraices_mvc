import express from 'express';
import {admin, create} from '../controllers/realEstateController.js';

const router = express.Router();

router.get('/my_real_estate', admin);
router.get('/real_estate/create', create);

export default router;