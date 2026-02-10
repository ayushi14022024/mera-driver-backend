import express from "express";
import { createinstagram, deleteinstagram, 
    getAllActiveData,getAllinstagrams, getinstagramById, updateinstagram,statusToggle } from "../controllers/instagram.controller.js";



const router = express.Router();

// Define instagram-specific routes here
router.post("", createinstagram);
router.get("/active", getAllActiveData);
router.get("/", getAllinstagrams);
router.get("/:id", getinstagramById);
router.put("/:id", updateinstagram);
router.delete("/:id", deleteinstagram);
router.put("/status/:id",statusToggle);

export default router;