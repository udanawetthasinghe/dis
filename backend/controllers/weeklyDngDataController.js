import asyncHandler from 'express-async-handler';
import weeklyDengueData from '../models/weeklyDngDataModel.js';
import User from '../models/userModel.js';

//@desc     Get all weekly dengue data
//@route    GET /api/weeklyDngData
//@access  Public (accessible by admins and researchers)
export const getWeeklyDngData = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit);
  const data = await weeklyDengueData.find().sort({ year: -1, week: 1 });

  // If a limit query parameter is provided, slice the results.
  const finalData = (!isNaN(limit) && limit > 0) ? data.slice(0, limit) : data;
  res.status(200).json(finalData);
});

//@desc     Get a single weekly dengue data record
//@route    GET /api/weeklyDngData/:id
//@access  Public (accessible by admins and researchers)
export const getSingleWeeklyDngData = asyncHandler(async (req, res) => {
  const record = await weeklyDengueData.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error("Weekly dengue data record not found");
  }
  res.status(200).json(record);
});



//@desc     returns an array of distinct years
//@route    GET /api/weeklyDngData/years
//@access  Public

export const getYears = asyncHandler(async (req, res) => {
  const years = await weeklyDengueData.distinct('year');
  res.status(200).json(years.sort((a, b) => b - a));
});

//@desc     returns all weekly records for that year
//@route    GET /api/weeklyDngData/years
//@access  Public

export const getWeeklyByYear = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year, 10);
  if (!year) {
    res.status(400);
    throw new Error('Missing required query param: year');
  }
  const records = await weeklyDengueData
    .find({ year })
    .select('districtId dengueCases week -_id')
    .lean();
    res.status(200).json(records);
});



//@desc     Create new weekly dengue data record(s)
//@route    POST /api/weeklyDngData
//@access  Admin only
export const createWeeklyDngData = asyncHandler(async (req, res) => {
  // Check if the logged-in user is valid and is an admin
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (user.userCat !== 1) {
    res.status(401);
    throw new Error("User not authorized to create records");
  }


  let createdRecords;


  // If the request body is an array, handle multiple inserts
  if (Array.isArray(req.body)) {
    // 1. Check for duplicates for each record
    for (const item of req.body) {
      const { year, week, districtId } = item;
      // Check if a record with same year, week, and districtId already exists
      const existingRecord = await weeklyDengueData.findOne({
        year,
        week,
        districtId,
      });
      if (existingRecord) {
        res.status(400);
        throw new Error(
          `Weekly dengue data already exists for year: ${year}, week: ${week}, district: ${districtId}`
        );
      }
    }




   // 2. If no duplicates found, insert many
   createdRecords = await weeklyDengueData.insertMany(
    req.body.map((item) => ({
      ...item,
      user: req.user.id,
    }))
  );
  } else {
    // Validate required fields for a single record
    const { year, week, districtId, dengueCases } = req.body;
    if (!year || !week || !districtId || (dengueCases === undefined)) {
      res.status(400);
      throw new Error("Missing required fields: year, week, districtId, dengueCases");
    }
    // Check for duplicates
    const existingRecord = await weeklyDengueData.findOne({
      year,
      week,
      districtId,
    });
    if (existingRecord) {
      res.status(400);
      throw new Error(
        `Weekly dengue data already exists for year: ${year}, week: ${week}, district: ${districtId}`
      );
    }

    createdRecords = await weeklyDengueData.create({
      user: req.user.id,
      year,
      week,
      districtId,
      dengueCases,
    });
  }
  res.status(201).json(createdRecords);
});

//@desc     Update a weekly dengue data record
//@route    PUT /api/weeklyDngData/:id
//@access  Admin only
export const updateWeeklyDngData = asyncHandler(async (req, res) => {
  const record = await weeklyDengueData.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error("Weekly dengue data record not found");
  }

  // Check if the logged-in user is valid and is an admin
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (user.userCat !== 1) {
    res.status(401);
    throw new Error("User not authorized to update records");
  }

  // Update the record with new values, if provided
  record.year = req.body.year || record.year;
  record.week = req.body.week || record.week;
  record.districtId = req.body.districtId || record.districtId;
  record.dengueCases = (req.body.dengueCases !== undefined) ? req.body.dengueCases : record.dengueCases;

  const updatedRecord = await record.save();
  res.status(200).json(updatedRecord);
});

//@desc     Delete a weekly dengue data record
//@route    DELETE /api/weeklyDngData/:id
//@access  Admin only
export const deleteWeeklyDngData = asyncHandler(async (req, res) => {
  const record = await weeklyDengueData.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error("Weekly dengue data record not found");
  }

  // Check if the logged-in user is valid and is an admin
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (user.userCat !== 1) {
    res.status(401);
    throw new Error("User not authorized to delete records");
  }

    await weeklyDengueData.deleteOne({ _id: req.params.id });
  res.status(200).json({ id: req.params.id });
});
