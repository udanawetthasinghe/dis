import mongoose from "mongoose";

const weeklyDengueDataSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    year: {
      type: Number,
      required: true,
    },
    week: {
        type: Number,
        required: true,
        min: 1,
        max: 52,
      },
    districtId: {
      type: String,
      required: true,
    },
    dengueCases: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("weeklyDengueData", weeklyDengueDataSchema);
