import express from "express";
import {
  createrole,
  getAllroles,
    getAllActiveData,
  getroleById,
  updaterole,
  deleterole,
  statusToggle
} from "../controllers/role.controller.js";

const router = express.Router();

router.post("/", createrole);
router.get("/active", getAllActiveData);
router.get("/", getAllroles);
router.get("/:id", getroleById);
router.put("/:id", updaterole);
router.delete("/:id", deleterole);
router.put("/status/:id",statusToggle);

export default router;
