// import franchisecontactinfo from "../models/franchisecontactinfo.model.js";
// import Country from "../models/country.model.js";
// import State from "../models/state.model.js";
// import FranchiseComponyInfo from "../models/franchisecomponyinfo.model.js";
// import fs from "fs";
// import { Op } from "sequelize";


// export const createfranchisecontactinfo = async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ error: "Request body is missing." });
//     }

//     const {
//       franchisecomponyinfoId,
//       business_name,
//       legal_first_name,
//       legal_last_name,
//       password,
//       address,
//       countryId,
//       stateId,
//       city,
//       zip,
//       phone,
//       skype_link,
//       whatsapp,
//     } = req.body;

//         const existingphonefranchisecompony = await franchisecontactinfo.findOne({ where: { phone } });
//     if (existingphonefranchisecompony) {
//       return res.status(400).json({ message: "Phone already exists" });
//     }
//     const newContactInfo = await franchisecontactinfo.create({
//       franchisecomponyinfoId,
//       business_name,
//       legal_first_name,
//       legal_last_name,
//       password,
//       address,
//       countryId,
//       stateId,
//       city,
//       zip,
//       phone,
//       skype_link,
//       whatsapp,
//     });

//     res.status(201).json({
//       message: "Franchise contact info created successfully",
//       data: newContactInfo,
//     });
//   } catch (error) {
//     console.error("Error creating contact info:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getAllfranchisecontactinfos = async (req, res) => {
//   try {
//     const franchiseContactInfos = await franchisecontactinfo.findAll({
//       include: [
//         {
//           model: FranchiseComponyInfo,
//           as: "franchisecomponyinfo",
//         },
//         {
//           model: Country,
//           as: "country",
//         },
//         {
//           model: State,
//           as: "state",
//         },
//       ],
//       order: [["id", "DESC"]],
//     });

//     res.status(200).json(franchiseContactInfos);
//   } catch (error) {
//     console.error("Error fetching franchise contact infos:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getAllfranchisecontactinfosByCompCountryStateID = async (req, res) => {
//   try {
//     const { franchisecomponyinfoId, countryId, stateId } = req.query;

//     const filters = {};
//     if (franchisecomponyinfoId) filters.franchisecomponyinfoId = franchisecomponyinfoId;
//     if (countryId) filters.countryId = countryId;
//     if (stateId) filters.stateId = stateId;

//     const franchiseContactInfos = await franchisecontactinfo.findAll({
//       where: filters,
//       include: [
//         { model: FranchiseComponyInfo, as: "franchisecomponyinfo" },
//         { model: Country, as: "country" },
//         { model: State, as: "state" },
//       ],
//       order: [["id", "DESC"]],
//     });

//     res.status(200).json(franchiseContactInfos);
//   } catch (error) {
//     console.error("Error fetching franchise contact infos:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getfranchisecontactinfoById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const franchisecontactinfodata = await franchisecontactinfo.findByPk(id,
//       {
//       include: [
//         {
//           model: FranchiseComponyInfo,
//           as: "franchisecomponyinfo",
//         },
//         {
//           model: Country,
//           as: "country",
//         },
//         {
//           model: State,
//           as: "state",
//         },
//       ],
//       order: [["id", "DESC"]],
//     }
//     );
//     if (!franchisecontactinfodata) return res.status(404).json({ message: "franchisecontactinfo not found" });
//     res.status(200).json(franchisecontactinfodata);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const updatefranchisecontactinfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       franchisecomponyinfoId,
//       business_name,
//       legal_first_name,
//       legal_last_name,
//       password,
//       address,
//       countryId,
//       stateId,
//       city,
//       zip,
//       phone,
//       skype_link,
//       whatsapp
//     } = req.body || {};
    
//     // Check required fields
//     if (!franchisecomponyinfoId) {
//       return res.status(400).json({ message: "Compony Name is required" });
//     }

//     const existingfranchisecontactinfo = await franchisecontactinfo.findByPk(id);
//     if (!existingfranchisecontactinfo) {
//       return res.status(404).json({ message: "franchisecontactinfo not found" });
//     }

//     if (phone) {
//       const existingPhone = await franchisecontactinfo.findOne({
//         where: { phone, id: { [Op.ne]: id } },
//       });
//       if (existingPhone) {
//         return res.status(400).json({ message: "Phone already exists" });
//       }
//     }
    
//     await existingfranchisecontactinfo.update({
//       franchisecomponyinfoId,
//       business_name,
//       legal_first_name,
//       legal_last_name,
//       password,
//       address,
//       countryId,
//       stateId,
//        city,
//       zip,
//       phone,
//       skype_link,
//       whatsapp
//     });

//     res.status(200).json({
//       message: "franchisecontactinfo updated successfully",
//       data: existingfranchisecontactinfo,
//     });
//   } catch (error) {
//     console.error("Error updating franchisecontactinfo:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// export const deletefranchisecontactinfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const franchisecontactinfodata = await franchisecontactinfo.findByPk(id);

//     if (!franchisecontactinfodata) return res.status(404).json({ message: "franchisecontactinfo not found" });

//     await franchisecontactinfodata.destroy();
//     res.status(200).json({ message: "franchisecontactinfo deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const statusToggle = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//    // ✅ Validate input
//     if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
//       return res.status(400).json({
//         message: "Invalid status. Allowed values: 'active' or 'inactive'.",
//       });
//     }

//     // ✅ Check if record exists
//     const franchisecontactinfodata = await franchisecontactinfo.findByPk(id);
//     if (!franchisecontactinfodata) {
//       return res.status(404).json({ message: "franchisecontactinfo not found." });
//     }

//     // ✅ Update status
//     await franchisecontactinfodata.update({ status: status.toLowerCase() });

//     return res.status(200).json({
//       message: `franchisecontactinfo status updated to '${status}'.`,
//       data: franchisecontactinfodata,
//     });
//   } catch (error) {
//     console.error("❌ Error toggling franchisecontactinfo status:", error);
//     return res.status(500).json({
//       message: "Internal server error while updating franchisecontactinfo status.",
//       error: error.message,
//     });
//   }
// };








import franchisecontactinfo from "../models/franchisecontactinfo.model.js";
import Country from "../models/country.model.js";
import State from "../models/state.model.js";
import adminuser from "../models/adminuser.model.js";
import franchiseadminsec from "../models/franchiseadminsec.model.js";
import FranchiseBankInfo from "../models/franchisebankinfo.model.js";
import FranchiseComponyInfo from "../models/franchisecomponyinfo.model.js";
import fs from "fs";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 

export const createfranchisecontactinfo = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const {
      franchisecomponyinfoId,
      business_name,
      legal_first_name,
      legal_last_name,
      password,
      address,
      countryId,
      stateId,
      city,
      zip,
      phone,
      skype_link,
      whatsapp,
    } = req.body;

    // ✅ Validate required fields
    if (!franchisecomponyinfoId || !legal_first_name || !phone || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // ✅ Check for duplicate phone number
    const existingPhone = await franchisecontactinfo.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    // ✅ Check if franchise company exists
    const existingCompany = await FranchiseComponyInfo.findOne({
      where: { id: franchisecomponyinfoId },
    });

    if (!existingCompany) {
      return res.status(404).json({ message: "Franchise company not found" });
    }

    // ✅ Hash the password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPassword = password;


    // ✅ Update corresponding admin user
    const getAdminUser = await adminuser.findByPk(existingCompany.adminuserId);

    if (!getAdminUser) {
      return res.status(404).json({ message: "Linked admin user not found" });
    }

    // ✅ Generate and update a new JWT token for admin user
    const token = jwt.sign(
      {
        id: getAdminUser.id,
        email: getAdminUser.email,
        role: getAdminUser.role || "Franchise",
      },
      process.env.JWT_SECRET || "skylabs-secret-key-2025",
      { expiresIn: "7d" }
    );

    await getAdminUser.update({
      name: legal_first_name,
      phone_number: phone,
      password: hashedPassword,
      token,
    });

    // ✅ Create new contact info entry
    const newContactInfo = await franchisecontactinfo.create({
      franchisecomponyinfoId,
      business_name,
      legal_first_name,
      legal_last_name,
      password: hashedPassword,
      address,
      countryId,
      stateId,
      city,
      zip,
      phone,
      skype_link,
      whatsapp,
    });

    return res.status(201).json({
      message: "Franchise contact info created successfully",
      data: newContactInfo,
      token,
    });
  } catch (error) {
    console.error("Error creating contact info:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllfranchisecontactinfos = async (req, res) => {
  try {
    const franchiseContactInfos = await franchisecontactinfo.findAll({
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
      order: [["id", "DESC"]],
    });

    res.status(200).json(franchiseContactInfos);
  } catch (error) {
    console.error("Error fetching franchise contact infos:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllfranchisecontactinfosByCompCountryStateID = async (req, res) => {
  try {
    const { franchisecomponyinfoId, countryId, stateId } = req.query;

    const filters = {};
    if (franchisecomponyinfoId) filters.franchisecomponyinfoId = franchisecomponyinfoId;
    if (countryId) filters.countryId = countryId;
    if (stateId) filters.stateId = stateId;

    const franchiseContactInfos = await franchisecontactinfo.findAll({
      where: filters,
      include: [
        { model: FranchiseComponyInfo, as: "franchisecomponyinfo" },
        { model: Country, as: "country" },
        { model: State, as: "state" },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(franchiseContactInfos);
  } catch (error) {
    console.error("Error fetching franchise contact infos:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getfranchisecontactinfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const franchisecontactinfodata = await franchisecontactinfo.findByPk(id,
      {
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
      order: [["id", "DESC"]],
    }
    );
    if (!franchisecontactinfodata) return res.status(404).json({ message: "franchisecontactinfo not found" });
    res.status(200).json(franchisecontactinfodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatefranchisecontactinfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      franchisecomponyinfoId,
      business_name,
      legal_first_name,
      legal_last_name,
      password,
      address,
      countryId,
      stateId,
      city,
      zip,
      phone,
      skype_link,
      whatsapp,
    } = req.body || {};

    // ✅ Validate required fields
    if (!franchisecomponyinfoId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    // ✅ Find existing contact
    const existingContact = await franchisecontactinfo.findByPk(id);
    if (!existingContact) {
      return res.status(404).json({ message: "Franchise contact info not found" });
    }

    // ✅ Check for duplicate phone number
    if (phone) {
      const existingPhone = await franchisecontactinfo.findOne({
        where: { phone, id: { [Op.ne]: id } },
      });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone already exists" });
      }
    }

    // ✅ Check if company exists
    const existingCompany = await FranchiseComponyInfo.findByPk(franchisecomponyinfoId);
    if (!existingCompany) {
      return res.status(404).json({ message: "Franchise company not found" });
    }

    // ✅ Fetch related admin user
    const getAdminUser = await adminuser.findByPk(existingCompany.adminuserId);
    if (!getAdminUser) {
      return res.status(404).json({ message: "Linked admin user not found" });
    }

    // ✅ Hash password if provided, else keep old password
    let hashedPassword = getAdminUser.password;
    if (password) {
      // hashedPassword = await bcrypt.hash(password, 10);
      hashedPassword = password;
    }

    // ✅ Generate new JWT token (if phone/password updated)
    const token = jwt.sign(
      {
        id: getAdminUser.id,
        email: getAdminUser.email,
        role: "Franchise",
      },
      process.env.JWT_SECRET || "skylabs-secret-key-2025",
      { expiresIn: "7d" }
    );

    // ✅ Update admin user
    await getAdminUser.update({
      name: legal_first_name || getAdminUser.name,
      phone_number: phone || getAdminUser.phone_number,
      password: hashedPassword,
      token,
    });

    // ✅ Update franchise contact info
    await existingContact.update({
      franchisecomponyinfoId,
      business_name,
      legal_first_name,
      legal_last_name,
      password: hashedPassword,
      address,
      countryId,
      stateId,
      city,
      zip,
      phone,
      skype_link,
      whatsapp,
    });

    return res.status(200).json({
      message: "Franchise contact info updated successfully",
      data: existingContact,
      token,
    });

  } catch (error) {
    console.error("Error updating franchise contact info:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const deletefranchisecontactinfo = async (req, res) => {
  try {
    const { id } = req.params;
    const franchisecontactinfodata = await franchisecontactinfo.findByPk(id);

    if (!franchisecontactinfodata) return res.status(404).json({ message: "franchisecontactinfo not found" });

    await franchisecontactinfodata.destroy();
    res.status(200).json({ message: "franchisecontactinfo deleted successfully" });
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
    const franchisecontactinfodata = await franchisecontactinfo.findByPk(id);
    if (!franchisecontactinfodata) {
      return res.status(404).json({ message: "franchisecontactinfo not found." });
    }

    // ✅ Update status
    await franchisecontactinfodata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `franchisecontactinfo status updated to '${status}'.`,
      data: franchisecontactinfodata,
    });
  } catch (error) {
    console.error("❌ Error toggling franchisecontactinfo status:", error);
    return res.status(500).json({
      message: "Internal server error while updating franchisecontactinfo status.",
      error: error.message,
    });
  }
};
