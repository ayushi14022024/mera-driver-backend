import express from "express";
import {
  createclients,
  getAllclients,
  getAllActiveData,
  getclientById,
  updateclients,
  deleteclients,
  statusToggle
} from "../controllers/client.controller.js";

const router = express.Router();
import upload from "../middlewares/multer.js";


 
router.post("/",upload.fields([
  { name: 'profilePhoto', maxCount: 10 }
]) ,createclients);
router.get("/active", getAllActiveData);
router.get("/", getAllclients);
router.get("/:id", getclientById);
router.put("/:id",upload.fields([
  { name: 'profilePhoto', maxCount: 10 }
]) , updateclients);
router.delete("/:id", deleteclients);
router.put("/status/:id",statusToggle);
export default router;
