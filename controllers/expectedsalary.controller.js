import expectedsalary from "../models/expectedsalary.model.js";
import { Op } from "sequelize";

// ➕ Create Expected Salary
export const createexpectedsalary = async (req, res) => {
  try {
    const { name, salary, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    // ✅ Check for duplicate name
    const existing = await expectedsalary.findOne({ where: { name } });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Expected salary name already exists" });
    }

    const newExpectedSalary = await expectedsalary.create({
      name,
      salary,
       status: status || "active",
    });

    res.status(201).json({
      message: "Expected salary created successfully",
      data: newExpectedSalary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Expected Salary
export const updateexpectedsalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, status } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const existingRecord = await expectedsalary.findByPk(id);
    if (!existingRecord) {
      return res
        .status(404)
        .json({ message: "Expected salary record not found" });
    }

    // ✅ Check for duplicate name (excluding current record)
    const duplicate = await expectedsalary.findOne({
      where: {
        name,
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Expected salary name already exists" });
    }

    await existingRecord.update({ name, salary, status });

    res.status(200).json({
      message: "Expected salary updated successfully",
      data: existingRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All expectedsalarys
export const getAllexpectedsalarys = async (req, res) => {
  try {
    const expectedsalarys = await expectedsalary.findAll();
    res.status(200).json(expectedsalarys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const expectedsalarys = await expectedsalary.findAll({where: { status: "active" }});
    res.status(200).json(expectedsalarys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get expectedsalary by ID
export const getexpectedsalaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const expectedsalarydata = await expectedsalary.findByPk(id);
    if (!expectedsalarydata) return res.status(404).json({ message: "expectedsalary not found" });
    res.status(200).json(expectedsalarydata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ❌ Delete expectedsalary
export const deleteexpectedsalary = async (req, res) => {
  try {
    const { id } = req.params;
    const expectedsalarydata = await expectedsalary.findByPk(id);

    if (!expectedsalarydata) return res.status(404).json({ message: "expectedsalary not found" });

    await expectedsalarydata.destroy();
    res.status(200).json({ message: "expectedsalary deleted successfully" });
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
    const expectedsalarydata = await expectedsalary.findByPk(id);
    if (!expectedsalarydata) {
      return res.status(404).json({ message: "expectedsalary not found." });
    }

    // ✅ Update status
    await expectedsalarydata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `expectedsalary status updated to '${status}'.`,
      data: expectedsalarydata,
    });
  } catch (error) {
    console.error("❌ Error toggling expectedsalary status:", error);
    return res.status(500).json({
      message: "Internal server error while updating expectedsalary status.",
      error: error.message,
    });
  }
};