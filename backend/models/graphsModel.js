// models/graphsModel.js
import mongoose from 'mongoose';

const graphSchema = mongoose.Schema(
  {
    graphIndex: {
      type: Number,
      required: true,
    },
    graphName: {
      type: String,
      required: true,
    },
    graphType: {
      type: String,
      required: true,
    },
    graphDescrip: {
      type: String,
      required: true,
    },
    // Optional configuration object for future settings
    configuration: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically creates createdAt & updatedAt fields
  }
);

export default mongoose.model('Graph', graphSchema);