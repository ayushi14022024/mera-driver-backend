import express from "express";
import {
  createdrivertype,
  getAlldrivertypes,
    getAllActiveData,
  getdrivertypeById,
  updatedrivertype,
  deletedrivertype,
  statusToggle
} from "../controllers/drivertype.controller.js";

const router = express.Router();

router.post("/", createdrivertype);
router.get("/active", getAllActiveData);
router.get("/", getAlldrivertypes);
router.get("/:id", getdrivertypeById);
router.put("/:id", updatedrivertype);
router.delete("/:id", deletedrivertype);
router.put("/status/:id",statusToggle);

export default router;
