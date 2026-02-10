import express from "express";
import {
  createstate,
  getAllstates,
  getstateById,
    getAllActiveData,
    getAllActiveStateByCountryId,
  updatestate,
  deletestate,
  statusToggle
} from "../controllers/state.controller.js";

const router = express.Router();

router.post("/", createstate);
router.get("/active", getAllActiveData);
router.get("/getbyids", getAllActiveStateByCountryId);
router.get("/", getAllstates);
router.get("/:id", getstateById);
router.put("/:id", updatestate);
router.delete("/:id", deletestate);
router.put("/status/:id",statusToggle);

export default router;
