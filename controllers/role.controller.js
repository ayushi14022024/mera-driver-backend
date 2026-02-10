import role from "../models/role.model.js";
import { Op } from "sequelize";

// ➕ Create role
export const createrole = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "role name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingrole = await role.findOne({
      where: { name: name.trim() },
    });

    if (existingrole) {
      return res
        .status(400)
        .json({ message: "role name already exists." });
    }

    // ✅ Create new role
    const newrole = await role.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "role created successfully",
      data: newrole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✏️ Update role
export const updaterole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "role name is required." });
    }

    // ✅ Check if role exists
    const roleData = await role.findByPk(id);
    if (!roleData) {
      return res.status(404).json({ message: "role not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicaterole = await role.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicaterole) {
      return res
        .status(400)
        .json({ message: "role name already exists." });
    }

    // ✅ Update the record
    await roleData.update({
      name: name.trim(),
      status,
    });

    return res.status(200).json({
      message: "role updated successfully",
      data: roleData,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📄 Get All roles
export const getAllroles = async (req, res) => {
  try {
    const roles = await role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const roles = await role.findAll({where: { status: "active" }});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get role by ID
export const getroleById = async (req, res) => {
  try {
    const { id } = req.params;
    const roledata = await role.findByPk(id);
    if (!roledata) return res.status(404).json({ message: "role not found" });
    res.status(200).json(roledata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete role
export const deleterole = async (req, res) => {
  try {
    const { id } = req.params;
    const roledata = await role.findByPk(id);

    if (!roledata) return res.status(404).json({ message: "role not found" });

    await roledata.destroy();
    res.status(200).json({ message: "role deleted successfully" });
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
    const roledata = await role.findByPk(id);
    if (!roledata) {
      return res.status(404).json({ message: "role not found." });
    }

    // ✅ Update status
    await roledata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `role status updated to '${status}'.`,
      data: roledata,
    });
  } catch (error) {
    console.error("❌ Error toggling role status:", error);
    return res.status(500).json({
      message: "Internal server error while updating role status.",
      error: error.message,
    });
  }
};