import express from "express";
import {
  createsubservice,
  getAllsubservices,
  getAllsubserviceByServiceID,
  getsubserviceById,
    getAllActiveData,
  updatesubservice,
  deletesubservice,
  statusToggle
} from "../controllers/subservice.controller.js";

const router = express.Router();

router.post("/", createsubservice);
router.get("/active", getAllActiveData);
router.get("/getbyids", getAllsubserviceByServiceID);
router.get("/", getAllsubservices);
router.get("/:id", getsubserviceById);
router.put("/:id", updatesubservice);
router.delete("/:id", deletesubservice);
router.put("/status/:id",statusToggle);

export default router;
