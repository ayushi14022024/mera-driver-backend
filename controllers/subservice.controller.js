import subservice from "../models/subservice.model.js";
import Service from "../models/service.model.js";
import { Op } from "sequelize";

// ➕ Create subservice
export const createsubservice = async (req, res) => {
  try {
    const { name, serviceId, status } = req.body;
console.log( req.body);

    if (!name || !serviceId) {
      return res.status(400).json({ message: "Name and serviceId are required" });
    }

    // ✅ Check for duplicate subservice name within same service
    const existingSubservice = await subservice.findOne({
      where: { name, serviceId },
    });

    if (existingSubservice) {
      return res
        .status(400)
        .json({ message: "Subservice name already exists under the same service" });
    }

    const newSubservice = await subservice.create({ name, serviceId,  status: status || "active", });
    res.status(201).json({
      message: "Subservice created successfully",
      data: newSubservice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update subservice
export const updatesubservice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,  serviceId, status } = req.body;

    if (!name || !serviceId) {
      return res.status(400).json({ message: "Name and serviceId are required" });
    }

    const subservicedata = await subservice.findByPk(id);
    if (!subservicedata) {
      return res.status(404).json({ message: "Subservice not found" });
    }

    // ✅ Check for duplicate subservice name within same service (excluding self)
    const duplicate = await subservice.findOne({
      where: {
        name,
        serviceId,
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Subservice name already exists under the same service" });
    }

    await subservicedata.update({ name, serviceId, status });

    const updatedSubservice = await subservice.findByPk(id, {
      include: {
        model: Service,
        as: "service",
       where: { status: "active" },
      },
    });

    res.status(200).json({
      message: "Subservice updated successfully",
      data: updatedSubservice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All subservices
export const getAllsubservices = async (req, res) => {
  try {
  
  const subservices = await subservice.findAll({
      include: {
        model: Service,
        as: "service",
      where: { status: "active" },
      },
    });

    res.status(200).json(subservices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
  
  const subservices = await subservice.findAll({
    where: { status: "active" },
      include: {
        model: Service,
        as: "service",
        where: { status: "active" },
      },
    });

    res.status(200).json(subservices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllsubserviceByServiceID = async (req, res) => {
  try {
    const { serviceId} = req.query;

    const filters = {};
    if (serviceId) filters.serviceId = serviceId;

    const subservicedata = await subservice.findAll({
       where: {
        status: "active", 
        ...filters,       
      },
      include: [
        { model: Service, as: "service",
              where: { status: "active" },
         }
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(subservicedata);
  } catch (error) {
    console.error("Error fetching sub service infos:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get subservice by ID
export const getsubserviceById = async (req, res) => {
  try {
    const { id } = req.params;
  
       const foundsubservice = await subservice.findByPk(id, {
      include: {
        model: Service,
        as: "service",
       where: { status: "active" },
      },
    });

    if (!foundsubservice) return res.status(404).json({ message: "subservice not found" });
    res.status(200).json(foundsubservice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete subservice
export const deletesubservice = async (req, res) => {
  try {
    const { id } = req.params;
    const subservicedata = await subservice.findByPk(id);

    if (!subservicedata) return res.status(404).json({ message: "subservice not found" });

    await subservicedata.destroy();
    res.status(200).json({ message: "subservice deleted successfully" });
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
    const subservicedata = await subservice.findByPk(id);
    if (!subservicedata) {
      return res.status(404).json({ message: "subservice not found." });
    }

    // ✅ Update status
    await subservicedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `subservice status updated to '${status}'.`,
      data: subservicedata,
    });
  } catch (error) {
    console.error("❌ Error toggling subservice status:", error);
    return res.status(500).json({
      message: "Internal server error while updating subservice status.",
      error: error.message,
    });
  }
};