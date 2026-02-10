import { log } from "console";
import Source from "../models/source.model.js";
import { Op } from "sequelize";

// ➕ Create Source
export const createSource = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "driver type name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingSource = await Source.findOne({
      where: { name: name.trim() },
    });

    if (existingSource) {
      return res
        .status(400)
        .json({ message: "driver type name already exists." });
    }

    // ✅ Create new driver type
    const newSource = await Source.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "driver type created successfully",
      data: newSource,
    });
  } catch (error) {
    console.error("Error creating driver type:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📄 Get All Sources
export const getAllSources = async (req, res) => {
  try {
    const sources = await Source.findAll();
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const sources = await Source.findAll({where: { status: "active" }});
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get Source by ID
export const getSourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const source = await Source.findByPk(id);
    if (!source) return res.status(404).json({ message: "Source not found" });
    res.status(200).json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Source
export const updateSource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "driver type name is required." });
    }

    // ✅ Check if driver type exists
    const SourceData = await Source.findByPk(id);
    if (!SourceData) {
      return res.status(404).json({ message: "driver type not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicateSource = await Source.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicateSource) {
      return res
        .status(400)
        .json({ message: "driver type name already exists." });
    }

    // ✅ Update the record
    await SourceData.update({
      name: name.trim(),
      status,
    });

    return res.status(200).json({
      message: "driver type updated successfully",
      data: SourceData,
    });
  } catch (error) {
    console.error("Error updating driver type:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ❌ Delete Source
export const deleteSource = async (req, res) => {
  try {
    const { id } = req.params;
    const source = await Source.findByPk(id);

    if (!source) return res.status(404).json({ message: "Source not found" });

    await source.destroy();
    res.status(200).json({ message: "Source deleted successfully" });
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
    const source = await Source.findByPk(id);
    if (!source) {
      return res.status(404).json({ message: "Source not found." });
    }

    // ✅ Update status
    await source.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `Source status updated to '${status}'.`,
      data: source,
    });
  } catch (error) {
    console.error("❌ Error toggling source status:", error);
    return res.status(500).json({
      message: "Internal server error while updating source status.",
      error: error.message,
    });
  }
};
