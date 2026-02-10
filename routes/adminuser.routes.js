import express from "express";
import {
  loginadminuser,
  createadminuser,
  getAlladminusers,
  getAlladminuserByrolepermissionId,
  getadminuserById,
  updateadminuser,
  deleteadminuser,
  statusToggle,
  getAllActiveData
} from "../controllers/adminuser.controller.js";

const router = express.Router();

router.post("/login", loginadminuser);
router.post("/", createadminuser);
router.get("/active", getAllActiveData);
router.get("/getbyids", getAlladminuserByrolepermissionId);
router.get("/:id", getadminuserById);
router.get("/", getAlladminusers);
router.put("/:id", updateadminuser);
router.delete("/:id", deleteadminuser);
router.put("/status/:id",statusToggle);
export default router;
