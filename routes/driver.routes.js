import express from 'express';
import {
  saveDriverSteps,
  getDriverDetails,
  bulkUpload,
  updateDriverStep,
  deleteDriver,
  listAllDrivers,
  listAllActiveDrivers,
  searchDrivers,
  statusToggle,
  filterDriversByStatus
} from '../controllers/driver.controller.js';
import upload from '../middlewares/multer.js';
const router = express.Router();
 
// Configure multer for file uploads
const driverUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 10 },
  { name: 'marksheet', maxCount: 10 },
  { name: 'certificate', maxCount: 10 },
  { name: 'medicalCertificate', maxCount: 10 },
  { name: 'fitnessCertificate', maxCount: 10 },
  { name: 'licenseFront', maxCount: 10 },
  { name: 'licenseBack', maxCount: 10 },
  { name: 'aadharFront', maxCount: 10 },
  { name: 'aadharBack', maxCount: 10 },
  { name: 'panCard', maxCount: 10 },
  { name: 'passportImage', maxCount: 10 },
  { name: 'visaImage', maxCount: 10 },
  { name: 'policeVerification', maxCount: 10 },
  { name: 'otherDocument', maxCount: 10 },
  { name: 'bankPassbook', maxCount: 10 },
   { name: 'QRImage', maxCount: 10 },
]);
 
// Routes
router.post('/save', (req, res, next) => {
  driverUpload(req, res, function (err) {
    if (err) {
      console.log("❌ Multer Error: ", err);
      return res.status(400).json({ error: err.message });
    }

    // No Multer error → next controller call
    saveDriverSteps(req, res, next);
  });
});

router.post('/bulk-upload', bulkUpload);
router.get('/active', listAllActiveDrivers);
router.get('/search', searchDrivers);
router.get('/status/:status', filterDriversByStatus);
router.get('/:id', getDriverDetails);
router.get('/', listAllDrivers);
router.put('/update',driverUpload, updateDriverStep);
router.delete('/:driverId', deleteDriver);
router.put("/status/:id",statusToggle);

 
export default router;
 
 