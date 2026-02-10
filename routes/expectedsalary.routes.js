import express from "express";
import {
  createexpectedsalary,
  getAllexpectedsalarys,
    getAllActiveData,
  getexpectedsalaryById,
  updateexpectedsalary,
  deleteexpectedsalary,
  statusToggle
} from "../controllers/expectedsalary.controller.js";

const router = express.Router();

router.post("/", createexpectedsalary);
router.get("/active", getAllActiveData);
router.get("/", getAllexpectedsalarys);
router.get("/:id", getexpectedsalaryById);
router.put("/:id", updateexpectedsalary);
router.delete("/:id", deleteexpectedsalary);
router.put("/status/:id",statusToggle);

export default router;
