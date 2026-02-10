import licencetype from "../models/licencetype.model.js";
import { Op } from "sequelize";

// ➕ Create licencetype
export const createlicencetype = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "licence type name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existinglicenceType = await licencetype.findOne({
      where: { name: name.trim() },
    });

    if (existinglicenceType) {
      return res
        .status(400)
        .json({ message: "licence type name already exists." });
    }

    // ✅ Create new licence type
    const newlicenceType = await licencetype.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "licence type created successfully",
      data: newlicenceType,
    });
  } catch (error) {
    console.error("Error creating licence type:", error);
    return res.status(500).json({ error: error.message });
  }
};


// 📄 Get All licencetypes
export const getAlllicencetypes = async (req, res) => {
  try {
    const licencetypes = await licencetype.findAll();
    res.status(200).json(licencetypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const licencetypes = await licencetype.findAll({where: { status: "active" }});
    res.status(200).json(licencetypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get licencetype by ID
export const getlicencetypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const licencetypedata = await licencetype.findByPk(id);
    if (!licencetypedata) return res.status(404).json({ message: "licencetype not found" });
    res.status(200).json(licencetypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update licencetype
export const updatelicencetype = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "licence type name is required." });
    }

    // ✅ Check if licence type exists
    const licenceTypeData = await licencetype.findByPk(id);
    if (!licenceTypeData) {
      return res.status(404).json({ message: "licence type not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicatelicenceType = await licencetype.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicatelicenceType) {
      return res
        .status(400)
        .json({ message: "licence type name already exists." });
    }

    // ✅ Update the record
    await licenceTypeData.update({
      name: name.trim(),
      status,
    });

    return res.status(200).json({
      message: "licence type updated successfully",
      data: licenceTypeData,
    });
  } catch (error) {
    console.error("Error updating licence type:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ❌ Delete licencetype
export const deletelicencetype = async (req, res) => {
  try {
    const { id } = req.params;
    const licencetypedata = await licencetype.findByPk(id);

    if (!licencetypedata) return res.status(404).json({ message: "licencetype not found" });

    await licencetypedata.destroy();
    res.status(200).json({ message: "licencetype deleted successfully" });
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
    const licencetypedata = await licencetype.findByPk(id);
    if (!licencetypedata) {
      return res.status(404).json({ message: "licencetype not found." });
    }

    // ✅ Update status
    await licencetypedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `licencetype status updated to '${status}'.`,
      data: licencetypedata,
    });
  } catch (error) {
    console.error("❌ Error toggling licencetype status:", error);
    return res.status(500).json({
      message: "Internal server error while updating licencetype status.",
      error: error.message,
    });
  }
};
