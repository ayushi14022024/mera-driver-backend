import express from "express";
import {
  createcmsservice,
  getAllcmsservices,
  getAllActiveData,
  getcmsserviceById,
  updatecmsservice,
  deletecmsservice,
  statusToggle
} from "../controllers/cmsservice.controller.js";

const router = express.Router();
import upload from "../middlewares/multer.js";

router.post("/", upload.single("image"),createcmsservice);
router.get("/active", getAllActiveData);
router.get("/", getAllcmsservices);
router.get("/:id", getcmsserviceById);
router.put("/:id",  upload.single("image"), updatecmsservice);
router.delete("/:id", deletecmsservice);
router.put("/status/:id",statusToggle);
export default router;
