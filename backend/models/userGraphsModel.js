// models/userGraphsModel.js
import mongoose from 'mongoose';

const userGraphSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model
      required: true,
    },
    graphId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Graph', // Reference to your Graph model
      required: true,
    },
    // New field for the graph title defined by the researcher
    graphTitle: {
      type: String,
      required: true,
    },
    apiRoute: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    xTitle: {
      type: String,
      required: true,
    },
    yTitle: {
      type: String,
      required: true,
    },
    // New field for workflow state:
    // 0: Testing (only researcher sees it)
    // 1: Submitted for approval
    // 3: Approved for public display
    // 5: Rejected
    state: {
      type: Number,
      default: 0,
      required: true,
    },
    configuration: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('UserGraph', userGraphSchema);