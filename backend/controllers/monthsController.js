import asyncHandler from 'express-async-handler';
import Month from "../models/monthsModel.js";

// Insert a new month

//@desc     Create a new month
//@route    POST /api/createMonth
// @access  Public
export const createMonth =  asyncHandler(async (req,res)=>{
  try {
    const { month, monthIndex } = req.body;
    
    // Check if the month already exists
    const existingMonth = await Month.findOne({ monthIndex });
    if (existingMonth) {
      return res.status(400).json({ message: "Month already exists" });
    }

    const newMonth = new Month({ month, monthIndex });
    await newMonth.save();

    res.status(201).json({ message: "Month added successfully", data: newMonth });
  } catch (error) {
    res.status(500).json({ message: "Error adding month", error: error.message });
  }
});