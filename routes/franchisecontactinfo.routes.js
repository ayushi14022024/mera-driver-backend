import express from "express";
import {
  createfranchisecontactinfo,
  getAllfranchisecontactinfos,
  getfranchisecontactinfoById,
  getAllfranchisecontactinfosByCompCountryStateID,
  updatefranchisecontactinfo,
  deletefranchisecontactinfo,
  statusToggle
} from "../controllers/franchisecontactinfo.controller.js";

const router = express.Router();

router.post("/", createfranchisecontactinfo);
router.get("/getbyids", getAllfranchisecontactinfosByCompCountryStateID);
router.get("/:id", getfranchisecontactinfoById);
router.get("/", getAllfranchisecontactinfos);
router.put("/:id", updatefranchisecontactinfo);
router.delete("/:id", deletefranchisecontactinfo);
router.put("/status/:id",statusToggle);

export default router;
