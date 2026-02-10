import service from "../models/service.model.js";
import { Op } from "sequelize";

export const createservice = async (req, res) => {
  try {
    const { name, amount,status } = req.body;
console.log(req.body);

    // ✅ Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "service name is required." });
    }

    // ✅ Check for duplicate name (case-insensitive optional)
    const existingservice = await service.findOne({
      where: { name: name.trim() },
    });

    if (existingservice) {
      return res
        .status(400)
        .json({ message: "service name already exists." });
    }

    // ✅ Create new service
    const newservice = await service.create({
      name: name.trim(),
      amount:amount,
      status: status || "active",
    });

    return res.status(201).json({
      message: "service created successfully",
      data: newservice,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: error.message });
  }
};
// 📄 Get All services
export const getAllservices = async (req, res) => {
  try {
    const services = await service.findAll();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const services = await service.findAll({where: { status: "active" }});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get service by ID
export const getserviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicedata = await service.findByPk(id);
    if (!servicedata) return res.status(404).json({ message: "service not found" });
    res.status(200).json(servicedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update service
export const updateservice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,amount, status } = req.body || {};

    // ✅ Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "service name is required." });
    }

    // ✅ Check if service exists
    const serviceData = await service.findByPk(id);
    if (!serviceData) {
      return res.status(404).json({ message: "servicenot found." });
    }

    // ✅ Check for duplicate name (exclude current record)
    const duplicateservice = await service.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }, // ensure it’s not the same record
      },
    });

    if (duplicateservice) {
      return res
        .status(400)
        .json({ message: "service name already exists." });
    }

    // ✅ Update the record
    await serviceData.update({
      name: name.trim(),
      amount:amount,
      status,
    });

    return res.status(200).json({
      message: "service updated successfully",
      data: serviceData,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ❌ Delete service
export const deleteservice = async (req, res) => {
  try {
    const { id } = req.params;
    const servicedata = await service.findByPk(id);

    if (!servicedata) return res.status(404).json({ message: "service not found" });

    await servicedata.destroy();
    res.status(200).json({ message: "service deleted successfully" });
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
    const servicedata = await service.findByPk(id);
    if (!servicedata) {
      return res.status(404).json({ message: "service not found." });
    }

    // ✅ Update status
    await servicedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `service status updated to '${status}'.`,
      data: servicedata,
    });
  } catch (error) {
    console.error("❌ Error toggling service status:", error);
    return res.status(500).json({
      message: "Internal server error while updating service status.",
      error: error.message,
    });
  }
};
