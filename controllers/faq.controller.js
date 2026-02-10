import faq from "../models/faq.model.js";
import { Op } from "sequelize";

// ➕ Create FAQ
export const createfaq = async (req, res) => {
  try {
    const { qustion, answer, status } = req.body;

    if (!qustion) {
      return res.status(400).json({ message: "Question is required" });
    }

    // ✅ Check for duplicate question
    const existingFaq = await faq.findOne({ where: { qustion } });
    if (existingFaq) {
      return res.status(400).json({ message: "FAQ question already exists" });
    }

    const newFaq = await faq.create({ qustion, answer,  status: status || "active" });
    res.status(201).json({ message: "FAQ created successfully", data: newFaq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update FAQ
export const updatefaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { qustion, answer, status } = req.body || {};

    if (!qustion) {
      return res.status(400).json({ message: "Question is required" });
    }

    const faqData = await faq.findByPk(id);
    if (!faqData) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // ✅ Check for duplicate question (excluding current record)
    const duplicate = await faq.findOne({
      where: {
        qustion,
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      return res.status(400).json({ message: "FAQ question already exists" });
    }

    await faqData.update({ qustion, answer, status });
    res.status(200).json({ message: "FAQ updated successfully", data: faqData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 📄 Get All faqs
export const getAllfaqs = async (req, res) => {
  try {
    const faqs = await faq.findAll();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const faqs = await faq.findAll({where: { status: "active" }});
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get faq by ID
export const getfaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faqdata = await faq.findByPk(id);
    if (!faqdata) return res.status(404).json({ message: "faq not found" });
    res.status(200).json(faqdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ❌ Delete faq
export const deletefaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faqdata = await faq.findByPk(id);

    if (!faqdata) return res.status(404).json({ message: "faq not found" });

    await faqdata.destroy();
    res.status(200).json({ message: "faq deleted successfully" });
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
    const faqdata = await faq.findByPk(id);
    if (!faqdata) {
      return res.status(404).json({ message: "faq not found." });
    }

    // ✅ Update status
    await faqdata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `faq status updated to '${status}'.`,
      data: faqdata,
    });
  } catch (error) {
    console.error("❌ Error toggling faq status:", error);
    return res.status(500).json({
      message: "Internal server error while updating faq status.",
      error: error.message,
    });
  }
};