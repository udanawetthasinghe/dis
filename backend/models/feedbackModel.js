import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema(
  {
    user: {
      type: String, // Can store a user id as string or "unknown_user"
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    district: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Store file path or URL
      required: false,
    },
    week: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
