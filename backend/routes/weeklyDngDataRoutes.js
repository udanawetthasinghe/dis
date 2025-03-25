import express from 'express';
const router = express.Router();

import { protect } from '../middleware/authMiddleware.js';
import { 
  getWeeklyDngData, 
  getSingleWeeklyDngData, 
  getYears,
  getWeeklyByYear,
  createWeeklyDngData, 
  updateWeeklyDngData, 
  deleteWeeklyDngData 
} from '../controllers/weeklyDngDataController.js';

// Static endpoints first
//Year vice dengue data get for heatmap inputs
router.route('/years').get(getYears);
router.route('/weekly').get(getWeeklyByYear);

// Get all weekly dengue data, Add weekly dengue data record(s)
router.route('/')
  .get(getWeeklyDngData)
  .post(protect, createWeeklyDngData);

// Get single weekly dengue data record, Update, Delete
router.route('/:id')
  .get(protect, getSingleWeeklyDngData)
  .put(protect, updateWeeklyDngData)
  .delete(protect, deleteWeeklyDngData);



export default router;
