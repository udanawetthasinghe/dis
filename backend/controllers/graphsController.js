// controllers/graphsController.js
import asyncHandler from 'express-async-handler';
import Graph from '../models/graphsModel.js';

// @desc    Get all graphs
// @route   GET /api/graphs
// @access  Public
export const getGraphs = asyncHandler(async (req, res) => {
  const graphs = await Graph.find();
  res.status(200).json(graphs);
});

// @desc    Get single graph by id
// @route   GET /api/graphs/:id
// @access  Public
export const getGraphById = asyncHandler(async (req, res) => {
  const graph = await Graph.findById(req.params.id);
  if (graph) {
    res.status(200).json(graph);
  } else {
    res.status(404);
    throw new Error('Graph not found');
  }
});

// @desc    Create a new graph
// @route   POST /api/graphs
// @access  Private
export const createGraph = asyncHandler(async (req, res) => {
  const { graphIndex, graphName, graphType, graphDescrip, configuration } = req.body;

  if (!graphName || !graphType || !graphDescrip) {
    res.status(400);
    throw new Error('Please provide graphName, graphType, and graphDescrip');
  }

  const graph = await Graph.create({
    graphIndex,
    graphName,
    graphType,
    graphDescrip,
    configuration,
  });

  res.status(201).json(graph);
});

// @desc    Update an existing graph
// @route   PUT /api/graphs/:id
// @access  Private
export const updateGraph = asyncHandler(async (req, res) => {
  const graph = await Graph.findById(req.params.id);
  if (!graph) {
    res.status(404);
    throw new Error('Graph not found');
  }

  const { graphIndex, graphName, graphType, graphDescrip, configuration } = req.body;
  graph.graphIndex = graphIndex || graph.graphIndex;
  graph.graphName = graphName || graph.graphName;
  graph.graphType = graphType || graph.graphType;
  graph.graphDescrip = graphDescrip || graph.graphDescrip;
  graph.configuration = configuration || graph.configuration;

  const updatedGraph = await graph.save();
  res.status(200).json(updatedGraph);
});

// @desc    Delete a graph
// @route   DELETE /api/graphs/:id
// @access  Private
export const deleteGraph = asyncHandler(async (req, res) => {
  const graph = await Graph.findById(req.params.id);
  if (!graph) {
    res.status(404);
    throw new Error('Graph not found');
  }

  await Graph.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Graph removed' });
});