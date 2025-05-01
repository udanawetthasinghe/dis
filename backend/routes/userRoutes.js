import express from "express";
import {
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
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, getUsersList); //GET method for admin
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// admin routes

router.route("/by-state/:state").get(protect, getUsersByState);
router
  .route("/:id")
  .get(protect, getUserData)
  .put(protect, updateUserProfileByAdmin)
  .delete(protect, deleteUser); // These routes are protected by the protect middleware.

router.post("/admin", protect, registerUserByAdmin);

export default router;
