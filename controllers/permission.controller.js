import permission from "../models/permission.model.js";
import { Op } from "sequelize";

// ➕ Create permission
export const createpermission = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "permission name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingpermission = await permission.findOne({
      where: { name: name.trim() },
    });

    if (existingpermission) {
      return res
        .status(400)
        .json({ message: "permission name already exists." });
    }

    // ✅ Create new permission
    const newpermission = await permission.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "permission created successfully",
      data: newpermission,
    });
  } catch (error) {
    console.error("Error creating permission:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✏️ Update permission
export const updatepermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "permission name is required." });
    }

    // ✅ Check if permission exists
    const permissionData = await permission.findByPk(id);
    if (!permissionData) {
      return res.status(404).json({ message: "permission not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicatepermission = await permission.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicatepermission) {
      return res
        .status(400)
        .json({ message: "permission name already exists." });
    }

    // ✅ Update the record
    await permissionData.update({
      name: name.trim(),
      status,
    });

    return res.status(200).json({
      message: "permission updated successfully",
      data: permissionData,
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📄 Get All permissions
export const getAllpermissions = async (req, res) => {
  try {
    const permissions = await permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const permissions = await permission.findAll({where: { status: "active" }});
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get permission by ID
export const getpermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permissiondata = await permission.findByPk(id);
    if (!permissiondata) return res.status(404).json({ message: "permission not found" });
    res.status(200).json(permissiondata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete permission
export const deletepermission = async (req, res) => {
  try {
    const { id } = req.params;
    const permissiondata = await permission.findByPk(id);

    if (!permissiondata) return res.status(404).json({ message: "permission not found" });

    await permissiondata.destroy();
    res.status(200).json({ message: "permission deleted successfully" });
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
    const permissiondata = await permission.findByPk(id);
    if (!permissiondata) {
      return res.status(404).json({ message: "permission not found." });
    }

    // ✅ Update status
    await permissiondata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `permission status updated to '${status}'.`,
      data: permissiondata,
    });
  } catch (error) {
    console.error("❌ Error toggling permission status:", error);
    return res.status(500).json({
      message: "Internal server error while updating permission status.",
      error: error.message,
    });
  }
};