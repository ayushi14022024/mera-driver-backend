import cmsservice from "../models/cmsservice.model.js";
import fs from "fs";
import { Op } from "sequelize";

// ➕ Create CMS Service
export const createcmsservice = async (req, res) => {
  try {
    const { name, details, status } = req.body;

    // ✅ Validate name
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // ✅ Validate image
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Check for duplicate name
    const existingService = await cmsservice.findOne({ where: { name } });
    if (existingService) {
      return res.status(400).json({ message: "CMS service name already exists" });
    }

    const image = `http://localhost:5000/${req.file.path}`;

    const newCmsService = await cmsservice.create({
      name,
      details,
      image,
      status: status || "active",
    });

    res.status(201).json({
      message: "CMS service created successfully",
      data: newCmsService,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update CMS Service
export const updatecmsservice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, details, status } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingCmsService = await cmsservice.findByPk(id);
    if (!existingCmsService) {
      return res.status(404).json({ message: "CMS service not found" });
    }

    // ✅ Check for duplicate name (excluding current record)
    const duplicate = await cmsservice.findOne({
      where: {
        name,
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      return res.status(400).json({ message: "CMS service name already exists" });
    }

    // ✅ Handle image update
    let updatedImage = existingCmsService.image;
    if (req.file) {
      if (existingCmsService.image && fs.existsSync(existingCmsService.image)) {
        fs.unlinkSync(existingCmsService.image); // delete old image (optional)
      }
      updatedImage = `http://localhost:5000/${req.file.path}`;
    }

    await existingCmsService.update({
      name,
      details,
      image: updatedImage,
      status,
    });

    res.status(200).json({
      message: "CMS service updated successfully",
      data: existingCmsService,
    });
  } catch (error) {
    console.error("Error updating CMS service:", error);
    res.status(500).json({ error: error.message });
  }
};


// 📄 Get All cmsservices
export const getAllcmsservices = async (req, res) => {
  try {
    const cmsservices = await cmsservice.findAll();
    res.status(200).json(cmsservices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllActiveData = async (req, res) => {
  try {
    const cmsservices = await cmsservice.findAll({where: { status: "active" }});
    res.status(200).json(cmsservices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔍 Get cmsservice by ID
export const getcmsserviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const cmsservicedata = await cmsservice.findByPk(id);
    if (!cmsservicedata) return res.status(404).json({ message: "cmsservice not found" });
    res.status(200).json(cmsservicedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ❌ Delete cmsservice
export const deletecmsservice = async (req, res) => {
  try {
    const { id } = req.params;
    const cmsservicedata = await cmsservice.findByPk(id);

    if (!cmsservicedata) return res.status(404).json({ message: "cmsservice not found" });

    await cmsservicedata.destroy();
    res.status(200).json({ message: "cmsservice deleted successfully" });
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
    const cmsservicedata = await cmsservice.findByPk(id);
    if (!cmsservicedata) {
      return res.status(404).json({ message: "cmsservice not found." });
    }

    // ✅ Update status
    await cmsservicedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `cmsservice status updated to '${status}'.`,
      data: cmsservicedata,
    });
  } catch (error) {
    console.error("❌ Error toggling cmsservice status:", error);
    return res.status(500).json({
      message: "Internal server error while updating cmsservice status.",
      error: error.message,
    });
  }
};