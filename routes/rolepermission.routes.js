import express from "express";
import {
  createrolepermission,
  getAllrolepermissions,
  getrolepermissionById,
    getAllActiveData,
    getrolepermissionsByFilter,
  updaterolepermission,
  deleterolepermission,
  statusToggle
} from "../controllers/rolepermission.controller.js";

const router = express.Router();

router.post("/", createrolepermission);
router.get("/active", getAllActiveData);
router.get("/getbyids", getrolepermissionsByFilter);
router.get("/", getAllrolepermissions);
router.get("/:id", getrolepermissionById);
router.put("/:id", updaterolepermission);
router.delete("/:id", deleterolepermission);
router.put("/status/:id",statusToggle);

export default router;
