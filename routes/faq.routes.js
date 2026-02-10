import express from "express";
import {
  createfaq,
  getAllfaqs,
    getAllActiveData,
  getfaqById,
  updatefaq,
  deletefaq,
  statusToggle
} from "../controllers/faq.controller.js";

const router = express.Router();

router.post("/", createfaq);
router.get("/active", getAllActiveData);
router.get("/", getAllfaqs);
router.get("/:id", getfaqById);
router.put("/:id", updatefaq);
router.delete("/:id", deletefaq);
router.put("/status/:id",statusToggle);

export default router;
