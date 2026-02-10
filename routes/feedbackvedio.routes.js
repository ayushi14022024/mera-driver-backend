import express from 'express';
import { createfeedbackvedio, deletefeedbackvedio,
    getAllActiveData,getAllfeedbackvedios, getfeedbackvedioById, updatefeedbackvedio,statusToggle } from '../controllers/feedbackvedio.controller.js';

const router = express.Router();

router.post('/', createfeedbackvedio);
router.get("/active", getAllActiveData);
router.get('/:id', getfeedbackvedioById);
router.get('/', getAllfeedbackvedios);
router.put('/:id', updatefeedbackvedio);
router.delete('/:id', deletefeedbackvedio);
router.put("/status/:id",statusToggle);

export default router;