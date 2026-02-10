import express from "express";
import {
  createblogs,
  getAllblogss,
  getAllActiveData,
  getblogsById,
  updateblogs,
  deleteblogs,
  statusToggle
} from "../controllers/blogs.controller.js";

const router = express.Router();
import upload from "../middlewares/multer.js";

router.post("/", upload.single("image"),createblogs);
router.get("/active", getAllActiveData);
router.get("/", getAllblogss);
router.get("/:id", getblogsById);
router.put("/:id",  upload.single("image"), updateblogs);
router.delete("/:id", deleteblogs);
router.put("/status/:id",statusToggle);
export default router;
