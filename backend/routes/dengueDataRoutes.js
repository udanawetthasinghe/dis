import express from 'express';
const router = express.Router();

import {protect} from '../middleware/authMiddleware.js'
import { getDngData, getSingleDngData, createDngData, updateDngData, deleteDngData} from '../controllers/dengueDataController.js';

// Get all dengue cases , Add dengue cases
router.route('/').get(getDngData).post(protect,createDngData);

// Get single dengue cases, Update dengue cases,delete dengue cases

router.route('/:id').get(getSingleDngData).put(protect,updateDngData).delete(protect,deleteDngData);


export default router;