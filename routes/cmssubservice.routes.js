import express from "express";

import {
  createcmssubservice,
  getAllcmssubservices,
  getAllcmssubserviceByCmsServiceID,
  getAllActiveData,
  getcmssubserviceById,
  updatecmssubservice,
  deletecmssubservice,
  statusToggle
} from "../controllers/cmssubservice.controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/",  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image_one", maxCount: 1 },
  ]), createcmssubservice);
  router.get("/active", getAllActiveData);
  router.get("/getbyids", getAllcmssubserviceByCmsServiceID);
router.get("/", getAllcmssubservices);
router.get("/:id", getcmssubserviceById);
router.put("/:id",  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image_one", maxCount: 1 },
  ]), updatecmssubservice);
router.delete("/:id", deletecmssubservice);
router.put("/status/:id",statusToggle);
export default router;
 
 