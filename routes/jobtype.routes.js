import express from "express";
import {
  createjobtype,
  getAlljobtypes,
    getAllActiveData,
  getjobtypeById,
  updatejobtype,
  deletejobtype,
  statusToggle
} from "../controllers/jobtype.controller.js";

const router = express.Router();

router.post("/", createjobtype);
router.get("/active", getAllActiveData);
router.get("/", getAlljobtypes);
router.get("/:id", getjobtypeById);
router.put("/:id", updatejobtype);
router.delete("/:id", deletejobtype);
router.put("/status/:id",statusToggle);

export default router;
