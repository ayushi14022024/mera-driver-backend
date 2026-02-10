import express from "express";
import {
  createcountry,
  getAllcountrys,
    getAllActiveData,
  getcountryById,
  updatecountry,
  deletecountry,
  statusToggle
} from "../controllers/country.controller.js";

const router = express.Router();

router.post("/", createcountry);
router.get("/active", getAllActiveData);
router.get("/", getAllcountrys);
router.get("/:id", getcountryById);
router.put("/:id", updatecountry);
router.delete("/:id", deletecountry);
router.put("/status/:id",statusToggle);
export default router;
