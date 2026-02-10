import express from "express";
import {
  createvehicletype,
  getAllvehicletypes,
  getvehicletypeById,
    getAllActiveData,
  updatevehicletype,
  deletevehicletype,
  statusToggle
} from "../controllers/vehicletype.controller.js";

const router = express.Router();

router.post("/", createvehicletype);
router.get("/active", getAllActiveData);
router.get("/", getAllvehicletypes);
router.get("/:id", getvehicletypeById);
router.put("/:id", updatevehicletype);
router.delete("/:id", deletevehicletype);
router.put("/status/:id",statusToggle);

export default router;
