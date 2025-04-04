// controllers/userGraphsController.js
import asyncHandler from 'express-async-handler';
import UserGraph from '../models/userGraphsModel.js';

// @desc    Get all user graphs
// @route   GET /api/usergraphs
// @access  Private
export const getUserGraphs = asyncHandler(async (req, res) => {
  // Optionally, filter by userId (if you want only the logged-in user's graphs)
  // For now, we'll return all user graphs with populated user and graph details.
  const userGraphs = await UserGraph.find()
    .populate('userId', 'name email') // Adjust fields as per User model
    .populate('graphId',  'graphName graphType');
  res.status(200).json(userGraphs);
});



// @desc    Get a single user graph by id
// @route   GET /api/usergraphs/:id
// @access  Private
export const getUserGraphById = asyncHandler(async (req, res) => {
  const userGraph = await UserGraph.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('graphId', 'graphName graphType');
  if (userGraph) {
    res.status(200).json(userGraph);
  } else {
    res.status(404);
    throw new Error('User graph not found');
  }
});

// @desc    Create a new user graph
// @route   POST /api/usergraphs
// @access  Private
export const createUserGraph = asyncHandler(async (req, res) => {
  const { graphId, graphTitle, apiRoute, description, xTitle, yTitle, configuration } = req.body;
  const userId= req.user.id;
  // Validate required fields
  if (!userId || !graphId || !apiRoute || !graphTitle) {
    res.status(400);
    throw new Error('Please provide userId, graphId, graphTitle, and apiRoute');
  }
  let state=0;
  if(req.user.userCat === 1||2){
    state=1;
  }


  // state defaults to 0 (testing) automatically
  const userGraph = await UserGraph.create({
    userId: userId,
    graphId,
    graphTitle,
    apiRoute,
    description,
    xTitle,
    yTitle,
    configuration,
    state, // initial state: testing
  });

  res.status(201).json(userGraph);
});

// @desc    Update an existing user graph
// @route   PUT /api/usergraphs/:id
// @access  Private
export const updateUserGraph = asyncHandler(async (req, res) => {
  const userGraph = await UserGraph.findById(req.params.id);
  if (!userGraph) {
    res.status(404);
    throw new Error('User graph not found');
  }

  const { userId, graphId, graphTitle, apiRoute, description, xTitle, yTitle, configuration, state } = req.body;

  // Allow update of fields, including the state if needed
  userGraph.userId = userId || userGraph.userId;
  userGraph.graphId = graphId || userGraph.graphId;
  userGraph.graphTitle = graphTitle || userGraph.graphTitle;
  userGraph.apiRoute = apiRoute || userGraph.apiRoute;
  userGraph.description = description || userGraph.description;
  userGraph.xTitle = xTitle || userGraph.xTitle;
  userGraph.yTitle = yTitle || userGraph.yTitle;
  userGraph.configuration = configuration || userGraph.configuration;
  userGraph.state = state !== undefined ? state : userGraph.state; // update state if provided

  const updatedUserGraph = await userGraph.save();
  res.status(200).json(updatedUserGraph);
});

// @desc    Delete a user graph
// @route   DELETE /api/usergraphs/:id
// @access  Private
export const deleteUserGraph = asyncHandler(async (req, res) => {
  const userGraph = await UserGraph.findById(req.params.id);
  if (!userGraph) {
    res.status(404);
    throw new Error('User graph not found');
  }
  await UserGraph.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: 'User graph removed' });
});
