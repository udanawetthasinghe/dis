import express from "express";
import { createMonth } from "../controllers/monthsController.js";

const router = express.Router();

// Create month route
router.post("/", createMonth); 
export default router;