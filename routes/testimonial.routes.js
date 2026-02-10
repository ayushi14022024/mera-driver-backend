import express from "express";
import {
  createtestimonial,
  getAlltestimonials,
    getAllActiveData,
  gettestimonialById,
  updatetestimonial,
  deletetestimonial,
  statusToggle
} from "../controllers/testimonial.controller.js";

const router = express.Router();
import upload from "../middlewares/multer.js";

router.post("/", upload.single("profile_pic"),createtestimonial);
router.get("/active", getAllActiveData);
router.get("/", getAlltestimonials);
router.get("/:id", gettestimonialById);
router.put("/:id",  upload.single("profile_pic"), updatetestimonial);
router.delete("/:id", deletetestimonial);
router.put("/status/:id",statusToggle);

export default router;
