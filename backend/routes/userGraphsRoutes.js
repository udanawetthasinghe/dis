import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserGraphs, getUserGraphById, createUserGraph, updateUserGraph, deleteUserGraph } from '../controllers/userGraphsController.js';

const router = express.Router();

// GET all user graphs and POST a new user graph (only authenticated users)
router.route('/')
  .get(getUserGraphs)
  .post(protect, createUserGraph);

// GET, PUT, DELETE a single user graph by ID (only authenticated users)
router.route('/:id')
  .get(getUserGraphById)
  .put(protect, updateUserGraph)
  .delete(protect, deleteUserGraph);

export default router;
