import franchisebankinfo from "../models/franchisebankinfo.model.js";
import FranchiseContactInfo from "../models/franchisecontactinfo.model.js";
import fs from "fs";

// ➕ Create franchisebankinfo
export const createfranchisebankinfo = async (req, res) => {
  try {
    const {
      bank_name,
      franchisecontactinfoId,
      branch_name,
      account_holder_name,
      ifsc_code,
      account_number,
      currency
    } = req.body;
console.log(req.body,"req.body bank......");

    const newfranchisebankinfo = await franchisebankinfo.create({
      bank_name,
      franchisecontactinfoId,
      branch_name,
      account_holder_name,
      ifsc_code,
      account_number,
      currency
    });

    res
      .status(201)
      .json({ message: "franchisebankinfo created successfully", data: newfranchisebankinfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All franchisebankinfos
export const getAllfranchisebankinfos = async (req, res) => {
  try {
    const franchisebankinfos = await franchisebankinfo.findAll({
      include: {
        model: FranchiseContactInfo,
        as: "franchisecontactinfo"
      },
    });
    res.status(200).json(franchisebankinfos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllfranchisebankinfosByContactID = async (req, res) => {
  try {
    const { franchisecontactinfoId} = req.query;

    const filters = {};
    if (franchisecontactinfoId) filters.franchisecontactinfoId = franchisecontactinfoId;

    const franchiseBankInfos = await franchisebankinfo.findAll({
      where: filters,
      include: [
        { model: FranchiseContactInfo, as: "franchisecontactinfo" }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(franchiseBankInfos);
  } catch (error) {
    console.error("Error fetching franchise bank infos:", error);
    res.status(500).json({ error: error.message });
  }
};


// 🔍 Get franchisebankinfo by ID
export const getfranchisebankinfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const franchisebankinfodata = await franchisebankinfo.findByPk(id,
      {
      include: {
        model: FranchiseContactInfo,
        as: "franchisecontactinfo"
      },
    }
    );
    if (!franchisebankinfodata) return res.status(404).json({ message: "franchisebankinfo not found" });
    res.status(200).json(franchisebankinfodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update franchisebankinfo
export const updatefranchisebankinfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bank_name,
      franchisecontactinfoId,
      branch_name,
      account_holder_name,
      ifsc_code,
      account_number,
      currency
    } = req.body || {};

    // Check required fields
    if (!bank_name) {
      return res.status(400).json({ message: "Bank Name is required" });
    }

    const existingfranchisebankinfo = await franchisebankinfo.findByPk(id);
    if (!existingfranchisebankinfo) {
      return res.status(404).json({ message: "franchisebankinfo not found" });
    }


    await existingfranchisebankinfo.update({
      bank_name,
      franchisecontactinfoId,
      branch_name,
      account_holder_name,
      ifsc_code,
      account_number,
      currency
    });

    res.status(200).json({
      message: "franchisebankinfo updated successfully",
      data: existingfranchisebankinfo,
    });
  } catch (error) {
    console.error("Error updating franchisebankinfo:", error);
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete franchisebankinfo
export const deletefranchisebankinfo = async (req, res) => {
  try {
    const { id } = req.params;
    const franchisebankinfodata = await franchisebankinfo.findByPk(id);

    if (!franchisefranchisebankinfodatabankinfo) return res.status(404).json({ message: "franchisebankinfo not found" });

    await franchisebankinfodata.destroy();
    res.status(200).json({ message: "franchisebankinfo deleted successfully" });
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
    const franchisebankinfodata = await franchisebankinfo.findByPk(id);
    if (!franchisebankinfodata) {
      return res.status(404).json({ message: "franchisebankinfo not found." });
    }

    // ✅ Update status
    await franchisebankinfodata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `franchisebankinfo status updated to '${status}'.`,
      data: franchisebankinfodata,
    });
  } catch (error) {
    console.error("❌ Error toggling franchisebankinfo status:", error);
    return res.status(500).json({
      message: "Internal server error while updating franchisebankinfo status.",
      error: error.message,
    });
  }
};