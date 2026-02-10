import express from "express";
import {
  createFollowUp,
  getAllFollowUps,
  getFollowUpByDriver,
} from "../controllers/followup.controller.js";
import upload from "../middlewares/multer.js";
 
const router = express.Router();
 
router.post("/",upload.none(), createFollowUp);
router.get("/", getAllFollowUps);
router.get("/driver/:driverId", getFollowUpByDriver);
 
export default router;