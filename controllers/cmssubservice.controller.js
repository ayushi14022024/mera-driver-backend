import cmssubservice from "../models/cmssubservice.model.js";
import CmsService from "../models/cmsservice.model.js";
import fs from "fs";

// ➕ Create
export const createcmssubservice = async (req, res) => {
  try {
    const { title, h1, h2, details, details_one, cmsserviceId, status } = req.body;
    const files = req.files;
  
    const image =  `http://localhost:5000/${files?.image?.[0]?.path}`;
    const image_one = `http://localhost:5000/${files?.image_one?.[0]?.path}`;

    if (!image || !image_one) {
      return res.status(400).json({ error: "Both image and image_one are required." });
    }

    const newcmssubservice = await cmssubservice.create({
      title,
      h1,
      h2,
      details,
      details_one,
      cmsserviceId,
      status: status || "active",
      image,
      image_one,
    });

    const populated = await cmssubservice.findByPk(newcmssubservice.id, {
      include: {
        model: CmsService,
        as: "cmsservice",
        where: { status: "active" },
      },
    });

    res.status(201).json({
      message: "cmssubservice created successfully",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update
export const updatecmssubservice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, h1, h2, details, details_one, cmsserviceId, status } = req.body;

    const found = await cmssubservice.findByPk(id);
    if (!found) {
      return res.status(404).json({ message: "cmssubservice not found" });
    }

    const files = req.files || {};
console.log(files,"files...........");

    // ✅ Properly handle image logic (use existing if not replaced)
    let image = found.image;
    let image_one = found.image_one;

    if (files.image && files.image[0]?.path) {
      image = `http://localhost:5000/${files.image[0].path}`;
      // Optional: delete old file safely
      if (found.image && fs.existsSync(found.image.replace("http://localhost:5000/", ""))) {
        fs.unlinkSync(found.image.replace("http://localhost:5000/", ""));
      }
    }

    if (files.image_one && files.image_one[0]?.path) {
   
      
      image_one = `http://localhost:5000/${files.image_one[0].path}`;
      // Optional: delete old file safely
      if (found.image_one && fs.existsSync(found.image_one.replace("http://localhost:5000/", ""))) {
        fs.unlinkSync(found.image_one.replace("http://localhost:5000/", ""));
      }
    }

    // ✅ Update record safely
    await found.update({
      title,
      h1,
      h2,
      details,
      details_one,
      cmsserviceId,
      status,
      image,
      image_one,
    });

    const updated = await cmssubservice.findByPk(id, {
      include: {
        model: CmsService,
        as: "cmsservice",
        where: { status: "active" },
      },
    });

    res.status(200).json({
      message: "cmssubservice updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All
export const getAllcmssubservices = async (req, res) => {
  try {
    const list = await cmssubservice.findAll({
      include: {
        model: CmsService,
        as: "cmsservice",
        attributes: ["id", "name", "details", "status"],
      },
    });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllActiveData = async (req, res) => {
  try {
    const list = await cmssubservice.findAll({
       where: { status: "active" },
      include: {
        model: CmsService,
        as: "cmsservice",
        where: { status: "active" },
      },
    });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllcmssubserviceByCmsServiceID = async (req, res) => {
  try {
    const { cmsserviceId} = req.query;

    const filters = {};
    if (cmsserviceId) filters.cmsserviceId = cmsserviceId;

    const cmssubservicedata = await cmssubservice.findAll({
       where: {
        status: "active", 
        ...filters,       
      },
      include: [
        { model: CmsService, as: "cmsservice",
              where: { status: "active" },
         }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(cmssubservicedata);
  } catch (error) {
    console.error("Error fetching cms sub service infos:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get by ID
export const getcmssubserviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await cmssubservice.findByPk(id, {
      include: {
        model: CmsService,
        as: "cmsservice",
        where: { status: "active" },
      },
    });

    if (!found) {
      return res.status(404).json({ message: "cmssubservice not found" });
    }

    res.status(200).json(found);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete
export const deletecmssubservice = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await cmssubservice.findByPk(id);
    if (!found) {
      return res.status(404).json({ message: "cmssubservice not found" });
    }

    // Delete images from disk
    if (fs.existsSync(found.image)) fs.unlinkSync(found.image);
    if (fs.existsSync(found.image_one)) fs.unlinkSync(found.image_one);

    await found.destroy();
    res.status(200).json({ message: "cmssubservice deleted successfully" });
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
    const cmssubservicedata = await cmssubservice.findByPk(id);
    if (!cmssubservicedata) {
      return res.status(404).json({ message: "cmssubservice not found." });
    }

    // ✅ Update status
    await cmssubservicedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `cmssubservice status updated to '${status}'.`,
      data: cmssubservicedata,
    });
  } catch (error) {
    console.error("❌ Error toggling cmssubservice status:", error);
    return res.status(500).json({
      message: "Internal server error while updating cmssubservice status.",
      error: error.message,
    });
  }
};