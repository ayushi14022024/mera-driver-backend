import express from "express";
import {
  createservice,
  getAllservices,
  getserviceById,
    getAllActiveData,
  updateservice,
  deleteservice,
  statusToggle
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", createservice);
router.get("/active", getAllActiveData);
router.get("/", getAllservices);
router.get("/:id", getserviceById);
router.put("/:id", updateservice);
router.delete("/:id", deleteservice);
router.put("/status/:id",statusToggle);

export default router;
