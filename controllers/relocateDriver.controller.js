import relocateDriver from "../models/relocateDriver.model.js";
import Driver from "../models/driver.model.js";
import AdminUser from "../models/adminuser.model.js";
import { Op } from "sequelize";


export const RelocateDriver = async (req, res) => {
  try {
    const { driverIds, adminUserId } = req.body;

    if (!driverIds || !Array.isArray(driverIds) || driverIds.length === 0) {
      return res.status(400).json({ error: "driverIds is required" });
    }

    if (!adminUserId) {
      return res.status(400).json({ error: "adminUserId is required" });
    }

    let results = [];

    // 1️⃣ Get all existing driver IDs for this adminUserId
    const existingRecords = await relocateDriver.findAll({
      where: { adminUserId },
    });

    const existingDriverIds = existingRecords.map(e => e.driverId);

    // 2️⃣ Handle create + update
    for (const driverId of driverIds) {
      let existing = await relocateDriver.findOne({
        where: { driverId, adminUserId },
      });

      if (existing) {
        await existing.update({ driverId, adminUserId });
        results.push({ updated: true, driverId });
      } else {
        await relocateDriver.create({ driverId, adminUserId });
        results.push({ created: true, driverId });
      }
    }

    // 3️⃣ Handle delete (records NOT in driverIds)
    const idsToDelete = existingDriverIds.filter(id => !driverIds.includes(id));

    if (idsToDelete.length > 0) {
      await relocateDriver.destroy({
        where: {
          adminUserId,
          driverId: idsToDelete,
        },
      });

      results.push({
        deleted: idsToDelete,
      });
    }

    return res.status(200).json({
      message: "Relocation sync completed",
      results,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 📄 Get All
export const getAllrelocateDrivers = async (req, res) => {
  try {
    const { driverId, adminUserId } = req.query;

    let where = {};

    if (driverId) {
      where.driverId = driverId;
    }

    if (adminUserId) {
      where.adminUserId = adminUserId;
    }

    const list = await relocateDriver.findAll({
      where,
      include: [
        { model: Driver, as: "driver" },
        { model: AdminUser, as: "adminUser" }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(list);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getrelocateDriversByFilter = async (req, res) => {
  try {
    const { adminUserId, driverId } = req.query;

    const filters = {};
    if (adminUserId) filters.adminUserId = adminUserId;
    if (driverId) filters.driverId = driverId;

    const list = await relocateDriver.findAll({
      where: { ...filters },
         include: [
        { model: Driver, as: "driver" },
        { model: AdminUser, as: "adminUser" }
      ],
      order: [["id", "DESC"]],
    });
    return res.status(200).json(list); // ✅ return

  } catch (error) {
    return res.status(500).json({ error: error.message }); // optional return
  }
};



