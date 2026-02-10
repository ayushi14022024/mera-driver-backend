import drivertype from "../models/drivertype.model.js";
import { Op } from "sequelize";

// ➕ Create drivertype
export const createdrivertype = async (req, res) => {
  try {
    const { name, status } = req.body;

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "driver type name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingdriverType = await drivertype.findOne({
      where: { name: name.trim() },
    });

    if (existingdriverType) {
      return res
        .status(400)
        .json({ message: "driver type name already exists." });
    }

    // ✅ Create new driver type
    const newdriverType = await drivertype.create({
      name: name.trim(),
      status: status || "active",
    });

    return res.status(201).json({
      message: "driver type created successfully",
      data: newdriverType,
    });
  } catch (error) {
    console.error("Error creating driver type:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✏️ Update drivertype
export const updatedrivertype = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "driver type name is required." });
    }

    // ✅ Check if driver type exists
    const driverTypeData = await drivertype.findByPk(id);
    if (!driverTypeData) {
      return res.status(404).json({ message: "driver type not found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicatedriverType = await drivertype.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicatedriverType) {
      return res
        .status(400)
        .json({ message: "driver type name already exists." });
    }

    // ✅ Update the record
    await driverTypeData.update({
      name: name.trim(),
      status,
    });

    return res.status(200).json({
      message: "driver type updated successfully",
      data: driverTypeData,
    });
  } catch (error) {
    console.error("Error updating driver type:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📄 Get All drivertypes
export const getAlldrivertypes = async (req, res) => {
  try {
    const drivertypes = await drivertype.findAll();
    res.status(200).json(drivertypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const drivertypes = await drivertype.findAll({where: { status: "active" }});
    res.status(200).json(drivertypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔍 Get drivertype by ID
export const getdrivertypeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const drivertypedata = await drivertype.findByPk(id);
    console.log(drivertypedata);
    
    if (!drivertypedata) return res.status(404).json({ message: "drivertype not found" });
    res.status(200).json(drivertypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ❌ Delete drivertype
export const deletedrivertype = async (req, res) => {
  try {
    const { id } = req.params;
    const drivertypedata = await drivertype.findByPk(id);

    if (!drivertypedata) return res.status(404).json({ message: "drivertype not found" });

    await drivertypedata.destroy();
    res.status(200).json({ message: "drivertype deleted successfully" });
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
    const drivertypedata = await drivertype.findByPk(id);
    if (!drivertypedata) {
      return res.status(404).json({ message: "drivertype not found." });
    }

    // ✅ Update status
    await drivertypedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `drivertype status updated to '${status}'.`,
      data: drivertypedata,
    });
  } catch (error) {
    console.error("❌ Error toggling drivertype status:", error);
    return res.status(500).json({
      message: "Internal server error while updating drivertype status.",
      error: error.message,
    });
  }
};