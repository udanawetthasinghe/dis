import asyncHandler from 'express-async-handler';
import Feedback from '../models/feedbackModel.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Helper function to compute ISO week number from a Date
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// @desc    Create new feedback record
// @route   POST /api/feedback
// @access  Public (or Protected if you want to restrict it)
export const createFeedback = asyncHandler(async (req, res) => {

let token;

  token = req.cookies.jwt;

  if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password'); // get user without password
    }




  // Retrieve values from req.body and req.file (if using multer for file upload)
  const { lat, lng, district, description } = req.body;
  // If a file was uploaded, assume middleware (e.g., multer) set req.file.path
  //const image = req.file ? req.file.path : null;

// send file name only to the database
const image = req.file ? req.file.filename : null;
  //console.log(req.user.id);
  // Determine the user ID: if logged in, use req.user.id, otherwise set as "unknown_user"
  const userId = req.user && req.user.id ? req.user.id : "unknown_user";

  // Automatically calculate the current ISO week number
  const currentWeek = getWeekNumber(new Date());

  const feedback = await Feedback.create({
    user: userId,
    location: { lat: Number(lat), lng: Number(lng) },
    district, // This value should be extracted from reverse geocoding on the frontend
    description,
    image,
    week: currentWeek,
  });

  res.status(201).json(feedback);
});

// @desc    Get all feedback records
// @route   GET /api/feedback
// @access  Public
export const getAllFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({}).sort({  createdAt: -1});
  res.json(feedbacks);
});

// @desc    Get feedback records by week number
// @route   GET /api/feedback/week?week=XX
// @access  Public
export const getFeedbackByWeek = asyncHandler(async (req, res) => {
  const week = Number(req.query.week);
  if (!week) {
    res.status(400);
    throw new Error('Week number is required');
  }
  const feedbacks = await Feedback.find({week});
  res.json(feedbacks);
});
// @desc    Get a feedback record by ID
// @route   GET /api/feedback/:id
// @access  Public
export const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (feedback) {
    res.json(feedback);
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});



// @desc    Delete a feedback record by ID
// @route   DELETE /api/feedback/:id
// @access  Protected (Admin or owner)
export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (feedback) {

        await feedback.deleteOne({ _id: feedback._id });
        res.json({ message: 'Feedback removed' });
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});
