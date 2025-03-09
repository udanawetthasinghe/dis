import asyncHandler from 'express-async-handler';
import dengueData from '../models/dngDataModel.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'; 
import {getMonthIndexByName, getMonthNameByIndex } from '../utils/monthHelpers.js';


//@desc     Get all dengue data
//@route    GET /api/dngData
// @access  Public
export const getDngData = asyncHandler(async (req, res) => {


  const dngData = await dengueData.find().sort({  year: -1, monthIndex: 1 });; // get the all dengue records
  const limit= parseInt(req.query.limit);

  // Declare finalData and assign the full dataset initially
  let finalData = dngData;


  if (!isNaN(limit) && limit >0){
    finalData = dngData.slice(0, limit);
  } 
//    res.json({
//         _id: dngData._id,
//         user: dngData.user,
//         year: dngData.year,
//         month: dngData.month,
//         districtId: dngData.districtId,
//         dengueCases: dngData.dengueCases,
//         rainfall: dngData.rainfall,



//       });
  // Convert monthIndex to month name for each document
  const result = await Promise.all(
    finalData.map(async (item) => {
      const monthName = await getMonthNameByIndex(item.monthIndex);
      return {
        ...item._doc,
        month: monthName, // add the month name
      };
    })
  );
res.status(201).json(result);
  
  
});

//@desc     Get a single dengue data
//@route    GET /api/dngData/:id
// @access  Public
export const getSingleDngData = asyncHandler(async (req,res)=>{

    const dngItem = await dengueData.findById(req.params.id);

    if (!dngItem) {
        res.status(404);
        throw new Error("Dengue record not found");
      }


 const monthName = await getMonthNameByIndex(dngItem.monthIndex);

  res.status(200).json({
    ...dngItem._doc,
    month: monthName,
  });

});


//@desc     Create a new dengue data
//@route    POST /api/dngData

export const createDngData = asyncHandler(async (req,res)=>{
  const { year, month, districtId, dengueCases, rainfall } = req.body;


    if (!req.body.dengueCases){
        res.status(400)
        throw new Error('Please insert number of dengue cases')
    }

 // Convert the month name from the frontend to monthIndex via DB lookup
 const monthIndex = await getMonthIndexByName(month);
 if (!monthIndex) {
   res.status(400);
   throw new Error("Invalid month name");
 }
    // Write the database -  collection name denguedata
  // Create the new record using monthIndex
  const dngRecord = await dengueData.create({
    user: req.user.id,
    year,
    monthIndex, // store as number
    districtId,
    dengueCases,
    rainfall,
  });
// Send the response back with the month name (for clarity)
res.status(201).json({
    ...dngRecord._doc,
    month, // include the original month name
  });
});

//@desc     Update dengue data
//@route    PUT /api/dngData/:id

export const updateDngData = asyncHandler(async (req,res)=>{


    const dngData = await dengueData.findById(req.params.id);

    if(!dngData){
        res.status(400);
        throw new Error('Dengue not found')
    }

// Check logged user authority for update the dengue cases...

const user= await User.findById(req.user.id)  // get logged user id

// Check login or not
if(!user){
    res.status(401)
    throw new Error('User not found')
}
console.log(user.userCat)
// Make sure the logged in user matches with admin profile
if(user.userCat !== (1||2)){
    res.status(401)
    throw new Error('User not authorized')
}

// const updatedDngData = await dengueData.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
// })
//res.status(200).json(updatedDngCases);

//////////////////////////////////////////////////////////////////////
 // Convert the month name from the frontend to monthIndex via DB lookup
 const monthIndex = await getMonthIndexByName(req.body.month);
 if (!monthIndex) {
   res.status(400);
   throw new Error("Invalid month name");
 }
    if (dngData) {
        dngData.user = req.user.id || dngData.user;
        dngData.year = req.body.year || dngData.year;
        dngData.monthIndex=monthIndex || dngData.monthIndex;
        dngData.districtId = req.body.districtId || dngData.districtId;
        dngData.dengueCases=req.body.dengueCases || dngData.dengueCases;
        dngData.rainfall = req.body.rainfall || dngData.rainfall;


  
      const updatedDengueData = await dngData.save();
  
      res.json({
        _id: updatedDengueData._id,
        user: updatedDengueData.user, 
        year: updatedDengueData.year,
        month: req.body.month,
        districtId: updatedDengueData.districtId,
        dengueCases: updatedDengueData.dengueCases,
        rainfall: updatedDengueData.rainfall,
      });
    } else {
      res.status(404);
      throw new Error('UsDengue data not found');
    }

});



//@desc     Delete dengue data
//@route    DELETE /api/dngData/:id



export const deleteDngData = asyncHandler(async (req,res)=>{
    const dngData = await dengueData.findById(req.params.id);

    console.log(req.params.id)
    if(!dngData){
        res.status(400);
        throw new Error('Dengue not found')
    }
// Check logged user authority for update the dengue cases...

const user= await User.findById(req.user.id)  // get logged user id

// Check login or not
if(!user){
    res.status(401)
    throw new Error('User not found')
}
console.log(user.userCat)
// Make sure the logged in user matches with admin profile
if(user.userCat !== (1||2)){
    res.status(401)
    throw new Error('User not authorized')
}

    await dengueData.deleteOne({ _id: req.params.id });

res.status(200).json({id: req.params.id});
});