import express from "express";
import {
  createlicencetype,
  getAlllicencetypes,
    getAllActiveData,
  getlicencetypeById,
  updatelicencetype,
  deletelicencetype,
  statusToggle
} from "../controllers/licencetype.controller.js";

const router = express.Router();

router.post("/", createlicencetype);
router.get("/active", getAllActiveData);
router.get("/", getAlllicencetypes);
router.get("/:id", getlicencetypeById);
router.put("/:id", updatelicencetype);
router.delete("/:id", deletelicencetype);
router.put("/status/:id",statusToggle);

export default router;
