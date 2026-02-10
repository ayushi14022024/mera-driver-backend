import express from "express";

import {
  createfranchisecomponyinfo,
  getAllfranchisecomponyinfo,
  getAllActiveData,
  getAllFranchiseComponyByAdminUserId,
  getfranchisecomponyinfoById,
  updatefranchisecomponyinfo,
  deletefranchisecomponyinfo,
  statusToggle
} from "../controllers/franchisecomponyinfo.controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/",  upload.fields([
    { name: "compony_logo", maxCount: 1 },
    { name: "business_certificate", maxCount: 1 },
  ]), createfranchisecomponyinfo);
  router.get("/active", getAllActiveData);
  router.get("/getbyids", getAllFranchiseComponyByAdminUserId);
router.get("/:id", getfranchisecomponyinfoById);
router.get("/", getAllfranchisecomponyinfo);
router.put("/:id",  upload.fields([
    { name: "compony_logo", maxCount: 1 },
    { name: "business_certificate", maxCount: 1 },
  ]), updatefranchisecomponyinfo);
router.delete("/:id", deletefranchisecomponyinfo);
router.put("/status/:id",statusToggle);

export default router;
 
 