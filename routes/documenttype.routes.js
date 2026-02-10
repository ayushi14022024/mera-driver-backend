import express from "express";
import {
  createdocumenttype,
  getAlldocumenttypes,
    getAllActiveData,
  getdocumenttypeById,
  updatedocumenttype,
  deletedocumenttype,
  statusToggle
} from "../controllers/documenttype.controller.js";

const router = express.Router();

router.post("/", createdocumenttype);
router.get("/active", getAllActiveData);
router.get("/", getAlldocumenttypes);
router.get("/:id", getdocumenttypeById);
router.put("/:id", updatedocumenttype);
router.delete("/:id", deletedocumenttype);
router.put("/status/:id",statusToggle);

export default router;
