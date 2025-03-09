import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {

    // Check whether user state is in activated state
    if(user.userState===1){
      generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userState: user.userState,
        userCat: user.userCat,
      });

    } else {
      res.status(401);
      throw new Error('Still your account is not activated')
    }
  
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
 
  const { name, email, password, userCat } = req.body;


  let userState=0; // if researcher register then userState=0, admin should activate

  if(userCat===4){
    userState=1; // if general user register automatically activate
  }
   
      // Check if user exists


  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    userState, 
    userCat,
  });

  if (user) {
   // generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userState: user.userState,
      userCat: user.userCat,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userState: user.userState,
      userCat: user.userCat,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
//req.user._id
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.userState=req.body.userState || user.userState;
    user.userCat = req.body.userCat || user.userCat;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userState: updatedUser.userState,
      userCat: updatedUser.userCat,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get users' list by admin
// @route   GET /api/users
// @access  Private
const getUsersList = asyncHandler(async (req, res) => {
  
  if(req.user.userCat !== 1){
    res.status(401)
    throw new Error('User not authorized')
}
  try {
    const users = await User.find().sort({  createdAt: -1});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});






// @desc    Get users by state
// @route   GET /api/users/by-state/:state
// @access  Private
const getUsersByState = asyncHandler(async (req, res) => {
  const userState = req.params.state;
  if(req.user.userCat !== 1){
    res.status(401)
    throw new Error('User not authorized')
}
  try {
    const users = await User.find({ userState: userState });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// @desc    Get user profile by admin by id
// @route   GET /api/users/:id
// @access  Private
const getUserData= asyncHandler(async (req, res) => {
  if(req.user.userCat !== 1){
    res.status(401)
    throw new Error('User not authorized')
}

try {
  const user = await User.findById(req.params.id);

  res.status(200).json(user);

} catch (error) {
  res.status(500).json({ message: 'Server Error', error });

}
});





// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfileByAdmin = asyncHandler(async (req, res) => {

  if(req.user.userCat !== 1){
    res.status(401)
    throw new Error('User not authorized')
}
  const user = await User.findById(req.params.id);
//req.user._id
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.userState=req.body.userState;
    user.userCat = req.body.userCat || user.userCat;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userState: updatedUser.userState,
      userCat: updatedUser.userCat,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Register a new user by Admin
// @route   POST /api/users/admin
// @access  Private
const registerUserByAdmin = asyncHandler(async (req, res) => {
 
  if(req.user.userCat !== 1){
    res.status(401)
    throw new Error('User not authorized')
}
  const { name, email, password, userCat, userState } = req.body;



  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    userState, 
    userCat,
  });

  if (user) {
   // generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userState: user.userState,
      userCat: user.userCat,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Delete user
// DELETE request, /api/users/:id
// Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsersByState,
  getUsersList,
  getUserData,
  updateUserProfileByAdmin,
  registerUserByAdmin,
  deleteUser,
};
