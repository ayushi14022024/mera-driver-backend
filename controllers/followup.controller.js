import  followup  from "../models/followup.model.js";
  import ServiceMaster from '../models/service.model.js';
   import SubServiceMaster from '../models/subservice.model.js';
import driver from '../models/driver.model.js';

// Create a new follow-up record
export const createFollowUp = async (req, res) => {
      console.log("Received Follow-Up Data:", req.body);
  try {

    const {
      driverId,
      nextCallDate,
      status,
      comments,
      serviceId,
      subServiceId,
      amount,
      discount,
      discountValue,
      paymentMode,
    } = req.body;

    // Basic Required Validation
    if (!driverId || !nextCallDate || !status) {
      return res
        .status(400)
        .json({ message: "Driver ID, Next Call Date & Status are required." });
    }

    // Optional: Check if serviceId is provided and numeric
    if (serviceId && isNaN(serviceId)) {
      return res.status(400).json({ message: "Invalid serviceId format." });
    }

    // Optional: Check if subServiceId is provided and numeric
    if (subServiceId && isNaN(subServiceId)) {
      return res.status(400).json({ message: "Invalid subServiceId format." });
    }


 const existingDriver = await driver.findByPk(driverId);
if (existingDriver) {
     const driverUpdateData = {
     categoryStatus:status,
       };
    await existingDriver.update(driverUpdateData);
}

    const followUp = await followup.create({
      driverId,
      nextCallDate,
      status,
      comments,
      serviceId: serviceId || null,
      subServiceId: subServiceId || null,
      amount: amount || 0,
      discount: discount || 0,
      discountValue: discountValue || 0,
      paymentMode: paymentMode || null,
    });

    return res.status(201).json({
      message: "Follow-up details saved successfully.",
      followUp,
    });
  } catch (error) {
    console.error("❌ Error saving follow-up:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

 
// Get all follow-ups
export const getAllFollowUps = async (req, res) => {
  try {
    const data = await followup.findAll({
     include: [
        {
          model: ServiceMaster,
          as: "service",
          required: false, // <-- IMPORTANT (optional join)
          where: { status: "active" },
        },
        {
          model: SubServiceMaster,
          as: "subservice",
          required: false, // <-- OPTIONAL join
          where: { status: "active" },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow-ups", error });
  }
};
 
// Get follow-ups by driver
export const getFollowUpByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    const data = await followup.findAll({
      where: { driverId },
      include: [
        {
          model: ServiceMaster,
          as: "service",
          required: false, // <-- IMPORTANT (optional join)
          where: { status: "active" },
        },
        {
          model: SubServiceMaster,
          as: "subservice",
          required: false, // <-- OPTIONAL join
          where: { status: "active" },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No follow-up records found for this driver" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching driver follow-ups:", error);
    res.status(500).json({ message: "Error fetching driver follow-ups", error });
  }
};

 
 
 
 