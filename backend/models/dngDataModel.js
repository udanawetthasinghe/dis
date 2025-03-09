import mongoose from "mongoose";

const dengueDataSchema = mongoose.Schema(
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
    monthIndex: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
      },
    districtId: {
      type: String,
      required: true,
    },
    dengueCases: {
      type: Number,
      required: true,
    },
    rainfall: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("dengueData", dengueDataSchema);
