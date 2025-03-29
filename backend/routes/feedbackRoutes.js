import express from 'express';
const router = express.Router();
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackByWeek,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import multer from 'multer';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // desired upload folder
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create feedback record (handles image upload)
router.route('/')
  .post(upload.single('image'), createFeedback)
  .get(getAllFeedback);

// Get feedback by ID and delete feedback
router.route('/:id')
  .get(getFeedbackById)
  .delete(deleteFeedback);

// Get feedback by week (e.g., /api/feedback/week?week=42)
router.route('/week')
  .get(getFeedbackByWeek);

export default router;
