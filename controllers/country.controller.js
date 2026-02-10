import country from "../models/country.model.js";
import { Op } from "sequelize";

// ➕ Create country
export const createcountry = async (req, res) => {
  try {
    const { name, code, status } = req.body;

    // ✅ Validate input
    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required." });
    }

    // ✅ Check for duplicate country (case-insensitive)
    const existingCountry = await country.findOne({
      where: { name },
    });

    if (existingCountry) {
      return res
        .status(400)
        .json({ message: "Country name already exists." });
    }

    // ✅ Create new country
    const newCountry = await country.create({
      name,
      code,
      status: status || "active",
    });

    return res.status(201).json({
      message: "Country created successfully",
      data: newCountry,
    });
  } catch (error) {
    console.error("Error creating country:", error);
    return res.status(500).json({ error: error.message });
  }
};


// 📄 Get All countrys
export const getAllcountrys = async (req, res) => {
  try {
    const countrys = await country.findAll();
    res.status(200).json(countrys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
  
    const countrys = await country.findAll({where: { status: "active" }});
    res.status(200).json(countrys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔍 Get country by ID
export const getcountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const countrydata = await country.findByPk(id);
    if (!countrydata) return res.status(404).json({ message: "country not found" });
    res.status(200).json(countrydata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update country
export const updatecountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, status } = req.body || {};

    // ✅ Basic validation
    if (!name) {
      return res.status(400).json({ message: "Country name is required." });
    }

    // ✅ Find the existing country by ID
    const countryData = await country.findByPk(id);
    if (!countryData) {
      return res.status(404).json({ message: "Country not found." });
    }

    // ✅ Check for duplicate name in other records
    const duplicateCountry = await country.findOne({
      where: {
        name,
        id: { [Op.ne]: id }, // ensure it's not the same record
      },
    });

    if (duplicateCountry) {
      return res
        .status(400)
        .json({ message: "Country name already exists." });
    }

    // ✅ Update record
    await countryData.update({
      name,
      code,
      status,
    });

    return res.status(200).json({
      message: "Country updated successfully",
      data: countryData,
    });
  } catch (error) {
    console.error("Error updating country:", error);
    return res.status(500).json({ error: error.message });
  }
};



// ❌ Delete country
export const deletecountry = async (req, res) => {
  try {
    const { id } = req.params;
    const countrydata = await country.findByPk(id);

    if (!countrydata) return res.status(404).json({ message: "country not found" });

    await countrydata.destroy();
    res.status(200).json({ message: "country deleted successfully" });
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
    const countrydata = await country.findByPk(id);
    if (!countrydata) {
      return res.status(404).json({ message: "country not found." });
    }

    // ✅ Update status
    await countrydata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `country status updated to '${status}'.`,
      data: countrydata,
    });
  } catch (error) {
    console.error("❌ Error toggling country status:", error);
    return res.status(500).json({
      message: "Internal server error while updating country status.",
      error: error.message,
    });
  }
};