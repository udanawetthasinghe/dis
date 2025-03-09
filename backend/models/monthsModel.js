import mongoose from "mongoose";

const monthSchema = mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  monthIndex: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
});

export default mongoose.model("months", monthSchema);
