import express from "express";
import {
  createfranchisebankinfo,
  getAllfranchisebankinfos,
  getfranchisebankinfoById,
  getAllfranchisebankinfosByContactID,
  updatefranchisebankinfo,
  deletefranchisebankinfo,
  statusToggle
} from "../controllers/franchisebankinfo.controller.js";

const router = express.Router();

router.post("/", createfranchisebankinfo);
router.get("/getbyids", getAllfranchisebankinfosByContactID);
router.get("/:id", getfranchisebankinfoById);
router.get("/", getAllfranchisebankinfos);
router.put("/:id", updatefranchisebankinfo);
router.delete("/:id", deletefranchisebankinfo);
router.put("/status/:id",statusToggle);

export default router;
