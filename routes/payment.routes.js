// routes/payment.routes.js
import express from "express";
import { createPayment, updatePaymentStatus } from "../controllers/payment.controller.js";
 
const router = express.Router();
 
router.post("/", createPayment); // Create new payment entry (cash/online)
router.put("/:paymentId", updatePaymentStatus); // Update status for cash payments
 
export default router;