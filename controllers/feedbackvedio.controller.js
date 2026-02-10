import feedbackvedio from "../models/feedbackvedio.model.js";

// Create feedbackvedio Entry
export const createfeedbackvedio = async (req, res) => {
    try {
        const {  category, youTubeLink, metaTag, metaDescription, status } = req.body;  
        const newfeedbackvedio = await feedbackvedio.create({  category, youTubeLink, metaTag, metaDescription,  status: status || "active" });
        res.status(201).json({ message: "feedbackvedio created successfully", data: newfeedbackvedio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllfeedbackvedios = async (req, res) => {
    try {
        const feedbackvedios = await feedbackvedio.findAll();
        res.status(200).json({ message: "feedbackvedio entries retrieved successfully", data: feedbackvedios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

export const getAllActiveData = async (req, res) => {
    try {
        const feedbackvedios = await feedbackvedio.findAll({where: { status: "active" }});
        res.status(200).json({ message: "feedbackvedio entries retrieved successfully", data: feedbackvedios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

export const getfeedbackvedioById = async (req, res) => {
    try {
        const { id } = req.params;  
        const feedbackvediodata = await feedbackvedio.findByPk(id);
        if (!feedbackvediodata) return res.status(404).json({ message: "feedbackvedio entry not found" });
        res.status(200).json({ message: "feedbackvedio entry retrieved successfully", data: feedbackvediodata });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  


export const updatefeedbackvedio = async (req, res) => {
    try {
        const { id } = req.params;  
        const {  category, youTubeLink, metaTag, metaDescription, status } = req.body || {};
        if ( !category) {
            return res.status(400).json({ message: " category are required" });
        }
        const feedbackvediodata = await feedbackvedio.findByPk(id);
        if (!feedbackvediodata) return res.status(404).json({ message: "feedbackvedio entry not found" });
        await feedbackvediodata.update({  category, youTubeLink, metaTag, metaDescription, status });
        res.status(200).json({ message: "feedbackvedio entry updated successfully", data: feedbackvediodata });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deletefeedbackvedio = async (req, res) => {
    try {
        const { id } = req.params;
        const feedbackvediodata = await feedbackvedio.findByPk(id);
        if (!feedbackvediodata) return res.status(404).json({ message: "feedbackvedio entry not found" });
        await feedbackvediodata.destroy();
        res.status(200).json({ message: "feedbackvedio entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
    const feedbackvediodata = await feedbackvedio.findByPk(id);
    if (!feedbackvediodata) {
      return res.status(404).json({ message: "feedbackvedio not found." });
    }

    // ✅ Update status
    await feedbackvediodata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `feedbackvedio status updated to '${status}'.`,
      data: feedbackvediodata,
    });
  } catch (error) {
    console.error("❌ Error toggling feedbackvedio status:", error);
    return res.status(500).json({
      message: "Internal server error while updating feedbackvedio status.",
      error: error.message,
    });
  }
};