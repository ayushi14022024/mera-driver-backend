import express from "express";
import {
 RelocateDriver,
 getAllrelocateDrivers,
 getrelocateDriversByFilter
} from "../controllers/relocateDriver.controller.js";

const router = express.Router();

router.post("/", RelocateDriver);
router.get("/getbyids", getrelocateDriversByFilter);
router.get("/", getAllrelocateDrivers);
export default router;
