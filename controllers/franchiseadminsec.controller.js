import franchiseadminsec from "../models/franchiseadminsec.model.js";
import FranchiseBankInfo from "../models/franchisebankinfo.model.js";
import FranchiseContactInfo from "../models/franchisecontactinfo.model.js";
import FranchiseComponyInfo from "../models/franchisecomponyinfo.model.js";
import Country from "../models/country.model.js";
import State from "../models/state.model.js";
import fs from "fs";

// ➕ Create franchiseadminsec
export const createfranchiseadminsec = async (req, res) => {
  try {
    const {
      franchisebankinfoId,
      commission_pay,
      commission_payment,
        approve_profile,
      status
    } = req.body;
  
   // File is available at req.file
    if (!req.file) {
      return res.status(400).json({ error: "Offer Letter is required." });
    }

    const offer_letter =  `http://localhost:5000/${req.file.path}`;// or save as URL if serving static files
    const newfranchiseadminsec = await franchiseadminsec.create({
      franchisebankinfoId,
      offer_letter,
      commission_pay,
      commission_payment,
        approve_profile,
       status: status || "active",
    });

    res
      .status(201)
      .json({ message: "franchiseadminsec created successfully", data: newfranchiseadminsec });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All franchiseadminsecs
export const getAllfranchiseadminsecs = async (req, res) => {
  try {
    const franchiseadminsecs = await franchiseadminsec.findAll({
      include: [
        {
          model: FranchiseBankInfo,
          as: "franchisebankinfo",
          include: [
            {
              model: FranchiseContactInfo,
              as: "franchisecontactinfo",
              include: [
                {
                  model: FranchiseComponyInfo,
                  as: "franchisecomponyinfo",
                },
                {
                  model: Country,
                  as: "country",
                },
                {
                  model: State,
                  as: "state",
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(franchiseadminsecs);
  } catch (error) {
    console.error("Error fetching franchise admin sections:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const franchiseadminsecs = await franchiseadminsec.findAll({
      // where: { status: "active" },
     include: [
        {
          model: FranchiseBankInfo,
          as: "franchisebankinfo",
          include: [
            {
              model: FranchiseContactInfo,
              as: "franchisecontactinfo",
              include: [
                {
                  model: FranchiseComponyInfo,
                  as: "franchisecomponyinfo",
                },
                {
                  model: Country,
                  as: "country",
                },
                {
                  model: State,
                  as: "state",
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json(franchiseadminsecs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllfranchiseadmininfosByBankID = async (req, res) => {
  try {
    const { franchisebankinfoId} = req.query;

    const filters = {};
    if (franchisebankinfoId) filters.franchisebankinfoId = franchisebankinfoId;

    const franchiseAdminInfos = await franchiseadminsec.findAll({
       where: {
        // status: "active", 
        ...filters,       
      },
      include: [
        {
          model: FranchiseBankInfo,
          as: "franchisebankinfo",
          include: [
            {
              model: FranchiseContactInfo,
              as: "franchisecontactinfo",
              include: [
                {
                  model: FranchiseComponyInfo,
                  as: "franchisecomponyinfo",
                },
                {
                  model: Country,
                  as: "country",
                },
                {
                  model: State,
                  as: "state",
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(franchiseAdminInfos);
  } catch (error) {
    console.error("Error fetching franchise admin infos:", error);
    res.status(500).json({ error: error.message });
  }
};
// 🔍 Get franchiseadminsec by ID
export const getfranchiseadminsecById = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseadminsecdata = await franchiseadminsec.findByPk(id,{
     include: [
        {
          model: FranchiseBankInfo,
          as: "franchisebankinfo",
          include: [
            {
              model: FranchiseContactInfo,
              as: "franchisecontactinfo",
              include: [
                {
                  model: FranchiseComponyInfo,
                  as: "franchisecomponyinfo",
                },
                {
                  model: Country,
                  as: "country",
                },
                {
                  model: State,
                  as: "state",
                },
              ],
            },
          ],
        },
      ],
    });
    if (!franchiseadminsecdata) return res.status(404).json({ message: "franchiseadminsec not found" });
    res.status(200).json(franchiseadminsecdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update franchiseadminsec
export const updatefranchiseadminsec = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      franchisebankinfoId,
      commission_pay,
      commission_payment,
        approve_profile,
      status
    } = req.body || {};

   

    const existingfranchiseadminsec = await franchiseadminsec.findByPk(id);
    if (!existingfranchiseadminsec) {
      return res.status(404).json({ message: "franchiseadminsec not found" });
    }

    let updatedofferletter = existingfranchiseadminsec.offer_letter;
    if (req.file) {
 
      if (existingfranchiseadminsec.offer_letter && fs.existsSync(existingfranchiseadminsec.offer_letter)) {
        fs.unlinkSync(existingfranchiseadminsec.offer_letter);
      }

      updatedofferletter =  `http://localhost:5000/${req.file.path}`;

    }

    await existingfranchiseadminsec.update({
      franchisebankinfoId,
      offer_letter :updatedofferletter,
      commission_pay,
      commission_payment,
        approve_profile,
      status
    });

    res.status(200).json({
      message: "franchiseadminsec updated successfully",
      data: existingfranchiseadminsec,
    });
  } catch (error) {
    console.error("Error updating franchiseadminsec:", error);
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete franchiseadminsec
export const deletefranchiseadminsec = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseadminsecdata = await franchiseadminsec.findByPk(id);

    if (!franchiseadminsecdata) return res.status(404).json({ message: "franchiseadminsec not found" });

    await franchiseadminsecdata.destroy();
    res.status(200).json({ message: "franchiseadminsec deleted successfully" });
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
    const franchiseadminsecdata = await franchiseadminsec.findByPk(id);
    if (!franchiseadminsecdata) {
      return res.status(404).json({ message: "franchiseadminsec not found." });
    }

    // ✅ Update status
    await franchiseadminsecdata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `franchiseadminsec status updated to '${status}'.`,
      data: franchiseadminsecdata,
    });
  } catch (error) {
    console.error("❌ Error toggling franchiseadminsec status:", error);
    return res.status(500).json({
      message: "Internal server error while updating franchiseadminsec status.",
      error: error.message,
    });
  }
};