import express from 'express';
import upload from '../middleware/upload.js';
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackByWeek,
  deleteFeedback,
} from '../controllers/feedbackController.js';

const router = express.Router();


// Create feedback record (handles image upload)
router.route('/')
  .post(upload.single('image'), createFeedback)
  .get(getAllFeedback);

  // Get feedback by week (e.g., /api/feedback/week?week=42)
router.route('/week')
.get(getFeedbackByWeek);

// Get feedback by ID and delete feedback
router.route('/:id')
  .get(getFeedbackById)
  .delete(deleteFeedback);



export default router;
