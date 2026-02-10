import express from "express";
import {
  createfranchiseadminsec,
  getAllfranchiseadminsecs,
    getAllActiveData,
    getAllfranchiseadmininfosByBankID,
  getfranchiseadminsecById,
  updatefranchiseadminsec,
  deletefranchiseadminsec,
  statusToggle
} from "../controllers/franchiseadminsec.controller.js";

const router = express.Router();
import upload from "../middlewares/multer.js";

router.post("/", upload.single("offer_letter"),createfranchiseadminsec);
router.get("/active", getAllActiveData);
router.get("/getbyids", getAllfranchiseadmininfosByBankID);
router.get("/:id", getfranchiseadminsecById);
router.get("/", getAllfranchiseadminsecs);
router.put("/:id",  upload.single("offer_letter"), updatefranchiseadminsec);
router.delete("/:id", deletefranchiseadminsec);
router.put("/status/:id",statusToggle);

export default router;
