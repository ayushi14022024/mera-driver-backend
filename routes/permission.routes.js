import express from "express";
import {
  createpermission,
  getAllpermissions,
    getAllActiveData,
  getpermissionById,
  updatepermission,
  deletepermission,
  statusToggle
} from "../controllers/permission.controller.js";

const router = express.Router();

router.post("/", createpermission);
router.get("/active", getAllActiveData);
router.get("/", getAllpermissions);
router.get("/:id", getpermissionById);
router.put("/:id", updatepermission);
router.delete("/:id", deletepermission);
router.put("/status/:id",statusToggle);

export default router;
