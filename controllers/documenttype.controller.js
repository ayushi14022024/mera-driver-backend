import documenttype from "../models/documenttype.model.js";
import { Op } from "sequelize";

export const createdocumenttype = async (req, res) => {
  try {
    const { title, details } = req.body;

    // ✅ Validate input
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required." });
    }

    // ✅ Check for duplicate title (case-insensitive optional)
    const existingDocumentType = await documenttype.findOne({
      where: { title },
    });

    if (existingDocumentType) {
      return res
        .status(400)
        .json({ message: "Document type title already exists." });
    }

    // ✅ Create new document type
    const newDocumentType = await documenttype.create({
      title: title.trim(),
      details: details || "",
    });

    return res.status(201).json({
      message: "Document type created successfully",
      data: newDocumentType,
    });
  } catch (error) {
    console.error("Error creating document type:", error);
    return res.status(500).json({ error: error.message });
  }
};


// 📄 Get All documenttypes
export const getAlldocumenttypes = async (req, res) => {
  try {
    const documenttypes = await documenttype.findAll();
    res.status(200).json(documenttypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const documenttypes = await documenttype.findAll({where: { status: "active" }});
    res.status(200).json(documenttypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get documenttype by ID
export const getdocumenttypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const documenttypedata = await documenttype.findByPk(id);
    if (!documenttypedata) return res.status(404).json({ message: "documenttype not found" });
    res.status(200).json(documenttypedata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatedocumenttype = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details } = req.body || {};

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required." });
    }

    // ✅ Find existing document type by ID
    const documentTypeData = await documenttype.findByPk(id);
    if (!documentTypeData) {
      return res.status(404).json({ message: "Document type not found." });
    }

    // ✅ Check for duplicate title (exclude current record)
    const duplicateDocType = await documenttype.findOne({
      where: {
        title: title.trim(),
        id: { [Op.ne]: id }, // ensure it's not the same record
      },
    });

    if (duplicateDocType) {
      return res
        .status(400)
        .json({ message: "Document type title already exists." });
    }

    // ✅ Update the document type
    await documentTypeData.update({
      title: title.trim(),
      details: details || "",
    });

    return res.status(200).json({
      message: "Document type updated successfully",
      data: documentTypeData,
    });
  } catch (error) {
    console.error("Error updating document type:", error);
    return res.status(500).json({ error: error.message });
  }
};



// ❌ Delete documenttype
export const deletedocumenttype = async (req, res) => {
  try {
    const { id } = req.params;
    const documenttypedata = await documenttype.findByPk(id);

    if (!documenttypedata) return res.status(404).json({ message: "documenttype not found" });

    await documenttypedata.destroy();
    res.status(200).json({ message: "documenttype deleted successfully" });
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
    const documenttypedata = await documenttype.findByPk(id);
    if (!documenttypedata) {
      return res.status(404).json({ message: "documenttype not found." });
    }

    // ✅ Update status
    await documenttypedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `documenttype status updated to '${status}'.`,
      data: documenttypedata,
    });
  } catch (error) {
    console.error("❌ Error toggling documenttype status:", error);
    return res.status(500).json({
      message: "Internal server error while updating documenttype status.",
      error: error.message,
    });
  }
};