import express from "express";
import {
  createSource,
  getAllSources,
    getAllActiveData,
  getSourceById,
  updateSource,
  deleteSource,
   statusToggle
} from "../controllers/source.controller.js";

const router = express.Router();

router.post("/", createSource);
router.get("/active", getAllActiveData);
router.get("/", getAllSources);
router.get("/:id", getSourceById);
router.put("/:id", updateSource);
router.delete("/:id", deleteSource);
router.put("/status/:id",statusToggle);

export default router;
