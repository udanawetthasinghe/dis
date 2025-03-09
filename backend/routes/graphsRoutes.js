import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getGraphs, getGraphById, createGraph, updateGraph, deleteGraph } from '../controllers/graphsController.js';

const router = express.Router();

// GET all graphs, POST a new graph (only authenticated users can create)
router.route('/')
  .get(getGraphs)
  .post(protect, createGraph);

// GET, PUT, DELETE a single graph by ID (only authenticated users can update/delete)
router.route('/:id')
  .get(getGraphById)
  .put(protect, updateGraph)
  .delete(protect, deleteGraph);

export default router;
