import vehicletype from "../models/vehicletype.model.js";
import { Op } from "sequelize";

export const createvehicletype = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Vehicle type name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingVehicleType = await vehicletype.findOne({
      where: { name: name.trim() },
    });

    if (existingVehicleType) {
      return res
        .status(400)
        .json({ message: "Vehicle type name already exists." });
    }

    // ✅ Create new vehicle type
    const newVehicleType = await vehicletype.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "Vehicle type created successfully",
      data: newVehicleType,
    });
  } catch (error) {
    console.error("Error creating vehicle type:", error);
    return res.status(500).json({ error: error.message });
  }
};


// 📄 Get All vehicletypes
export const getAllvehicletypes = async (req, res) => {
  try {
    const vehicletypes = await vehicletype.findAll();
    res.status(200).json(vehicletypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const vehicletypes = await vehicletype.findAll({where: { status: "active" }});
    res.status(200).json(vehicletypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get vehicletype by ID
export const getvehicletypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicletypedata = await vehicletype.findByPk(id);
    if (!vehicletypedata) return res.status(404).json({ message: "vehicletype not found" });
    res.status(200).json(vehicletypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update vehicletype
export const updatevehicletype = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Vehicle type name is required." });
    }

    // ✅ Check if vehicle type exists
    const vehicleTypeData = await vehicletype.findByPk(id);
    if (!vehicleTypeData) {
      return res.status(404).json({ message: "Vehicle type not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicateVehicleType = await vehicletype.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicateVehicleType) {
      return res
        .status(400)
        .json({ message: "Vehicle type name already exists." });
    }

    // ✅ Update the record
    await vehicleTypeData.update({
      name: name.trim(),
      status,
    });

    return res.status(200).json({
      message: "Vehicle type updated successfully",
      data: vehicleTypeData,
    });
  } catch (error) {
    console.error("Error updating vehicle type:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ❌ Delete vehicletype
export const deletevehicletype = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicletypedata = await vehicletype.findByPk(id);

    if (!vehicletypedata) return res.status(404).json({ message: "vehicletype not found" });

    await vehicletypedata.destroy();
    res.status(200).json({ message: "vehicletype deleted successfully" });
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
    const vehicletypedata = await vehicletype.findByPk(id);
    if (!vehicletypedata) {
      return res.status(404).json({ message: "vehicletype not found." });
    }

    // ✅ Update status
    await vehicletypedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `vehicletype status updated to '${status}'.`,
      data: vehicletypedata,
    });
  } catch (error) {
    console.error("❌ Error toggling vehicletype status:", error);
    return res.status(500).json({
      message: "Internal server error while updating vehicletype status.",
      error: error.message,
    });
  }
};