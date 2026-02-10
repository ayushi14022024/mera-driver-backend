import jobtype from "../models/jobtype.model.js";
import { Op } from "sequelize";

// ➕ Create jobtype
export const createjobtype = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "job type name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingjobType = await jobtype.findOne({
      where: { name: name.trim() },
    });

    if (existingjobType) {
      return res
        .status(400)
        .json({ message: "job type name already exists." });
    }

    // ✅ Create new job type
    const newjobType = await jobtype.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "job type created successfully",
      data: newjobType,
    });
  } catch (error) {
    console.error("Error creating job type:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📄 Get All jobtypes
export const getAlljobtypes = async (req, res) => {
  try {
    const jobtypedata = await jobtype.findAll();
    res.status(200).json(jobtypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const jobtypedata = await jobtype.findAll({where: { status: "active" }});
    res.status(200).json(jobtypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get jobtype by ID
export const getjobtypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobtypedata = await jobtype.findByPk(id);
    if (!jobtypedata) return res.status(404).json({ message: "jobtype not found" });
    res.status(200).json(jobtypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update jobtype
export const updatejobtype = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "job type name is required." });
    }

    // ✅ Check if job type exists
    const jobTypeData = await jobtype.findByPk(id);
    if (!jobTypeData) {
      return res.status(404).json({ message: "job type not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicatejobType = await jobtype.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicatejobType) {
      return res
        .status(400)
        .json({ message: "job type name already exists." });
    }

    // ✅ Update the record
    await jobTypeData.update({
      name: name.trim(),
      data:"data save ho gaya h.",
      status,
    });

    return res.status(200).json({
      message: "job type updated successfully",
      data: jobTypeData,
    });
  } catch (error) {
    console.error("Error updating job type:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ❌ Delete jobtype
export const deletejobtype = async (req, res) => {
  try {
    const { id } = req.params;
    const jobtypedata = await jobtype.findByPk(id);

    if (!jobtypedata) return res.status(404).json({ message: "jobtype not found" });

    await jobtypedata.destroy();
    res.status(200).json({ message: "jobtype deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const statusToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
   // ✅ Validate input
    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      });
    }

    // ✅ Check if record exists
    const jobtypedata = await jobtype.findByPk(id);
    if (!jobtypedata) {
      return res.status(404).json({ message: "jobtype not found." });
    }

    // ✅ Update status
    await jobtypedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `jobtype status updated to '${status}'.`,
      data: jobtypedata,
    });
  } catch (error) {
    console.error("❌ Error toggling jobtype status:", error);
    return res.status(500).json({
      message: "Internal server error while updating jobtype status.",
      error: error.message,
    });
  }
};