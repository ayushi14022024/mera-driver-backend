import instagram from "../models/instagram.model.js";


//Crate instagram Entry
export const createinstagram = async (req, res) => {
    try{
        const { url, status } = req.body;
        const newinstagram = await instagram.create({ url,  status: status || "active" });
        res.status(201).json({ message: "instagram created successfully", data: newinstagram });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Get all instagram Entries
export const getAllinstagrams = async (req, res) => {
    try {
        const instagrams = await instagram.findAll();
        res.status(200).json({ message: "instagram entries retrieved successfully", data: instagrams });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllActiveData = async (req, res) => {
    try {
        const instagrams = await instagram.findAll({where: { status: "active" }});
        res.status(200).json({ message: "instagram entries retrieved successfully", data: instagrams });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getinstagramById = async (req, res) => {
    try {
        const { id } = req.params;  
        const instagramdata = await instagram.findByPk(id);
        if (!instagramdata) return res.status(404).json({ message: "instagram entry not found" });
        res.status(200).json({ message: "instagram entry retrieved successfully", data: instagramdata });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updateinstagram = async (req, res) => {
    try {
        const { id } = req.params;
        const { url, status } = req.body || {};
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        const instagramdata = await instagram.findByPk(id);
        if (!instagramdata) return res.status(404).json({ message: "instagram entry not found" });
        await instagramdata.update({ url, status });
        res.status(200).json({ message: "instagram entry updated successfully", data: instagramdata });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const deleteinstagram = async (req, res) => {
    try {
        const { id } = req.params;  
        const instagramdata = await instagram.findByPk(id);
        if (!instagramdata) return res.status(404).json({ message: "instagram entry not found" });
        await instagramdata.destroy();
        res.status(200).json({ message: "instagram entry deleted successfully" });
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
    const instagramdata = await instagram.findByPk(id);
    if (!instagramdata) {
      return res.status(404).json({ message: "instagram not found." });
    }

    // ✅ Update status
    await instagramdata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `instagram status updated to '${status}'.`,
      data: instagramdata,
    });
  } catch (error) {
    console.error("❌ Error toggling instagram status:", error);
    return res.status(500).json({
      message: "Internal server error while updating instagram status.",
      error: error.message,
    });
  }
};