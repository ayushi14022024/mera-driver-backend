// import franchisecomponyinfo from "../models/franchisecomponyinfo.model.js";
// import fs from "fs";
// import { Op } from "sequelize";

// export const createfranchisecomponyinfo = async (req, res) => {
//   try {
//     const {
//       compony_name,
//       email,
//       website,
//       facebook_link,
//       instagram_link,
//       twitter_link,
//       linkedin_link,status
//     } = req.body;

//      const files = req.files;

//     const compony_logo =  `http://localhost:5000/${files?.compony_logo?.[0]?.path}`;
//     const business_certificate =  `http://localhost:5000/${files?.business_certificate?.[0]?.path}`;

//     if (!compony_logo || !business_certificate) {
//       return res.status(400).json({ error: "Both Compony Logo and Business Certificate are required." });
//     }

//      const existingnamefranchisecompony = await franchisecomponyinfo.findOne({ where: { compony_name } });
//     if (existingnamefranchisecompony) {
//       return res.status(400).json({ message: "Compony name already exists" });
//     }
//        const existingemailfranchisecompony = await franchisecomponyinfo.findOne({ where: { email } });
//     if (existingemailfranchisecompony) {
//       return res.status(400).json({ message: "Compony Email already exists" });
//     }
//     const newfranchisecomponyinfo = await franchisecomponyinfo.create({
//       compony_name,
//       email,
//       website,
//       facebook_link,
//       instagram_link,
//       twitter_link,
//       linkedin_link,
//       compony_logo,
//       business_certificate,
//          status: status || "active",
//     });

//     res
//       .status(201)
//       .json({ message: "franchisecomponyinfo created successfully", data: newfranchisecomponyinfo });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllfranchisecomponyinfo = async (req, res) => {
//   try {
//     const franchisecomponyinfo = await franchisecomponyinfo.findAll();
//     res.status(200).json(franchisecomponyinfo);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllActiveData = async (req, res) => {
//   try {
//     const franchisecomponyinfo = await franchisecomponyinfo.findAll({
//       where: { status: "active" },
//     });
//     res.status(200).json(franchisecomponyinfo);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getfranchisecomponyinfoById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const franchisecomponyinfodata = await franchisecomponyinfo.findByPk(id);
//     if (!franchisecomponyinfodata) return res.status(404).json({ message: "franchisecomponyinfo not found" });
//     res.status(200).json(franchisecomponyinfodata);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const updatefranchisecomponyinfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       compony_name,
//       email,
//       website,
//       facebook_link,
//       instagram_link,
//       twitter_link,
//       linkedin_link,
//       status
//     } = req.body;

//     const existingfranchisecomponyinfo = await franchisecomponyinfo.findByPk(id);
//     if (!existingfranchisecomponyinfo) {
//       return res.status(404).json({ message: "Franchise company info not found" });
//     }
//  const duplicatename = await franchisecomponyinfo.findOne({
//       where: {
//         compony_name,
//         id: { [Op.ne]: id },
//       },
//     });

//     if (duplicatename) {
//       return res.status(400).json({ message: "Compony name already exists" });
//     }
//      const duplicateemail = await franchisecomponyinfo.findOne({
//       where: {
//         email,
//         id: { [Op.ne]: id },
//       },
//     });

//     if (duplicateemail) {
//       return res.status(400).json({ message: "Compony Email already exists" });
//     }
//     const files = req.files;

//     let compony_logo = existingfranchisecomponyinfo.compony_logo;
//     let business_certificate = existingfranchisecomponyinfo.business_certificate;

//     // ✅ If new logo uploaded
//     if (files?.compony_logo?.[0]) {
      
//       compony_logo =  `http://localhost:5000/${files.compony_logo[0].path}`
//     }

//     // ✅ If new certificate uploaded
//     if (files?.business_certificate?.[0]) {
     
//       business_certificate =   `http://localhost:5000/${files.business_certificate[0].path}` 
//     }

    
//     // ✅ Update database with new or old names
//     await existingfranchisecomponyinfo.update({
//       compony_name,
//       email,
//       website,
//       facebook_link,
//       instagram_link,
//       twitter_link,
//       linkedin_link,
//       compony_logo,
//       business_certificate,
//          status
//     });

//     res.status(200).json({
//       message: "Franchise company info updated successfully",
//       data: existingfranchisecomponyinfo,
//     });

//   } catch (error) {
//     console.error("Error updating franchisecomponyinfo:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const deletefranchisecomponyinfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const franchisecomponyinfodata = await franchisecomponyinfo.findByPk(id);

//     if (!franchisecomponyinfodata) return res.status(404).json({ message: "franchisecomponyinfo not found" });

//     await franchisecomponyinfodata.destroy();

    
//     res.status(200).json({ message: "franchisecomponyinfo deleted successfully" });
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
//     const franchisecomponyinfodata = await franchisecomponyinfo.findByPk(id);
//     if (!franchisecomponyinfodata) {
//       return res.status(404).json({ message: "franchisecomponyinfo not found." });
//     }

//     // ✅ Update status
//     await franchisecomponyinfodata.update({ status: status.toLowerCase() });

//     return res.status(200).json({
//       message: `franchisecomponyinfo status updated to '${status}'.`,
//       data: franchisecomponyinfodata,
//     });
//   } catch (error) {
//     console.error("❌ Error toggling franchisecomponyinfo status:", error);
//     return res.status(500).json({
//       message: "Internal server error while updating franchisecomponyinfo status.",
//       error: error.message,
//     });
//   }
// };
















import adminuser from "../models/adminuser.model.js";
import franchiseadminsec from "../models/franchiseadminsec.model.js";
import FranchiseBankInfo from "../models/franchisebankinfo.model.js";
import FranchiseContactInfo from "../models/franchisecontactinfo.model.js";
import franchisecomponyinfo from "../models/franchisecomponyinfo.model.js";
import role from "../models/role.model.js";
import RolePermission from "../models/rolepermission.model.js";
import fs from "fs";
import { Op } from "sequelize";

export const createfranchisecomponyinfo = async (req, res) => {
  try {
    const {
      compony_name,
      email,
      website,
      facebook_link,
      instagram_link,
      twitter_link,
      linkedin_link,status
    } = req.body;

     const files = req.files;

    const compony_logo =  `http://localhost:5000/${files?.compony_logo?.[0]?.path}`;
    const business_certificate =  `http://localhost:5000/${files?.business_certificate?.[0]?.path}`;

    if (!compony_logo || !business_certificate) {
      return res.status(400).json({ error: "Both Compony Logo and Business Certificate are required." });
    }

     const existingnamefranchisecompony = await franchisecomponyinfo.findOne({ where: { compony_name } });
    if (existingnamefranchisecompony) {
      return res.status(400).json({ message: "Compony name already exists" });
    }
       const existingemailfranchisecompony = await franchisecomponyinfo.findOne({ where: { email } });
    if (existingemailfranchisecompony) {
      return res.status(400).json({ message: "Compony Email already exists" });
    }
    // role permission id 
     const existingFranchiserole = await role.findOne({
      where: { name: "Franchise" },
    });
  if (!existingFranchiserole) {
      return res.status(400).json({ error: "Franchise Role is not exist in Role Management" });
    }
  const getFranchiseRolePermission = await RolePermission.findOne({
      where: { roleId: existingFranchiserole.id },
    });
  if (!getFranchiseRolePermission) {
      return res.status(400).json({ error: "Franchise Role is not exist in Role Permission Management" });
    }

  const newAdmin = await adminuser.create({
      email,
      rolepermissionId:getFranchiseRolePermission.id,
      status: status || "active",
    });
    const newfranchisecomponyinfo = await franchisecomponyinfo.create({
      adminuserId:newAdmin.id,
      compony_name,
      email,
      website,
      facebook_link,
      instagram_link,
      twitter_link,
      linkedin_link,
      compony_logo,
      business_certificate,
         status: status || "active",
    });

    res
      .status(201)
      .json({ message: "franchisecomponyinfo created successfully", data: newfranchisecomponyinfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllfranchisecomponyinfo = async (req, res) => {
  try {

    const franchisecomponyinfodata = await franchisecomponyinfo.findAll(
      {
      include: [
        {
          model: adminuser,
          as: "adminuser",
        }
      ],
      order: [["id", "DESC"]],
    }
    );

    res.status(200).json(franchisecomponyinfodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const franchisecomponyinfodata = await franchisecomponyinfo.findAll({
      where: { status: "active" },
    });
    res.status(200).json(franchisecomponyinfodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllFranchiseComponyByAdminUserId = async (req, res) => {
  try {
       const { adminuserId} = req.query;

    const filters = {};
    if (adminuserId) filters.adminuserId = adminuserId;
    const franchisecomponyinfodata = await franchisecomponyinfo.findAll({
      where: { status: "active",
          ...filters, 
       },
          include: [
        { model: adminuser,
           as: "adminuser"
         }
      ],
      order: [["id", "DESC"]],
    });
   
    res.status(200).json(franchisecomponyinfodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getfranchisecomponyinfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const franchisecomponyinfodata = await franchisecomponyinfo.findByPk(id);
    if (!franchisecomponyinfodata) return res.status(404).json({ message: "franchisecomponyinfo not found" });
    res.status(200).json(franchisecomponyinfodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatefranchisecomponyinfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      adminuserId,
      compony_name,
      email,
      website,
      facebook_link,
      instagram_link,
      twitter_link,
      linkedin_link,
      status
    } = req.body;

    const existingfranchisecomponyinfo = await franchisecomponyinfo.findByPk(id);
    if (!existingfranchisecomponyinfo) {
      return res.status(404).json({ message: "Franchise company info not found" });
    }
 const duplicatename = await franchisecomponyinfo.findOne({
      where: {
        compony_name,
        id: { [Op.ne]: id },
      },
    });

    if (duplicatename) {
      return res.status(400).json({ message: "Compony name already exists" });
    }
     const duplicateemail = await franchisecomponyinfo.findOne({
      where: {
        email,
        id: { [Op.ne]: id },
      },
    });

    if (duplicateemail) {
      return res.status(400).json({ message: "Compony Email already exists" });
    }

const getadminuserData = await adminuser.findByPk(existingfranchisecomponyinfo.adminuserId);

if (!getadminuserData) {
  return res.status(404).json({ message: "Admin user not found" });
}

await getadminuserData.update({ email });

    const files = req.files;

    let compony_logo = existingfranchisecomponyinfo.compony_logo;
    let business_certificate = existingfranchisecomponyinfo.business_certificate;

    // ✅ If new logo uploaded
    if (files?.compony_logo?.[0]) {
      
      compony_logo =  `http://localhost:5000/${files.compony_logo[0].path}`
    }

    // ✅ If new certificate uploaded
    if (files?.business_certificate?.[0]) {
     
      business_certificate =   `http://localhost:5000/${files.business_certificate[0].path}` 
    }

    
    // ✅ Update database with new or old names
    await existingfranchisecomponyinfo.update({
      adminuserId:adminuserId || existingfranchisecomponyinfo.adminuserId,
      compony_name,
      email,
      website,
      facebook_link,
      instagram_link,
      twitter_link,
      linkedin_link,
      compony_logo,
      business_certificate,
         status
    });

    res.status(200).json({
      message: "Franchise company info updated successfully",
      data: existingfranchisecomponyinfo,
    });

  } catch (error) {
    console.error("Error updating franchisecomponyinfo:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deletefranchisecomponyinfo = async (req, res) => {
  try {
    const { id } = req.params;

   const deleteFranchiseCompony = await franchisecomponyinfo.findByPk(id);
 if (!deleteFranchiseCompony) {
      return res.status(404).json({ message: "franchisecomponyinfo not found" });
    }

   const deleteFranchiseAdminUser= await adminuser.findOne({
        where: { id: deleteFranchiseCompony.adminuserId },
      });
 if (deleteFranchiseAdminUser) {

    if (deleteFranchiseCompony) {
      const deleteFranchiseContact = await FranchiseContactInfo.findOne({
        where: { franchisecomponyinfoId: deleteFranchiseCompony.id },
      });

      if (deleteFranchiseContact) {
        const deleteFranchiseBank = await FranchiseBankInfo.findOne({
          where: { franchisecontactinfoId: deleteFranchiseContact.id },
        });

        if (deleteFranchiseBank) {
          const deleteFranchiseAdmin = await franchiseadminsec.findOne({
            where: { franchisebankinfoId: deleteFranchiseBank.id },
          });

          if (deleteFranchiseAdmin) {
            await deleteFranchiseAdmin.destroy();
          }

          await deleteFranchiseBank.destroy();
        }

        await deleteFranchiseContact.destroy();
      }

      await deleteFranchiseCompony.destroy();
    }

   await deleteFranchiseAdminUser.destroy();

    }
  
    res.status(200).json({ message: "franchisecomponyinfo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const statusToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedStatus = status?.toLowerCase();

    // 🔹 Validate input status
    if (!updatedStatus || !["active", "inactive"].includes(updatedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      });
    }

    // 🔹 Find Franchise Company
    const franchiseCompany = await franchisecomponyinfo.findByPk(id);

    if (!franchiseCompany) {
      return res.status(404).json({ message: "Franchise company not found." });
    }

    // 🔹 Find Contact Info (Optional but important)
    const franchiseContact = await FranchiseContactInfo.findOne({
      where: { franchisecomponyinfoId: franchiseCompany.id },
      include: [
        {
          model: franchisecomponyinfo,
          as: "franchisecomponyinfo",
        },
      ],
    });

    if (!franchiseContact) {
      return res.status(404).json({
        message: "Franchise contact info not found.",
      });
    }

    // 🔹 Find related AdminUser
    const adminUser = await adminuser.findOne({
      where: {
        email: franchiseCompany.email,
        phone_number: franchiseContact.phone,
      },
    });

    if (!adminUser) {
      return res.status(404).json({
        message: "Related admin user not found.",
      });
    }

    // 🔹 Update Admin User status
    await adminUser.update({ status: updatedStatus });

    // 🔹 Update Franchise Company status
    await franchiseCompany.update({ status: updatedStatus });

    return res.status(200).json({
      message: `Status updated to '${updatedStatus}'.`,
      data: franchiseCompany,
    });

  } catch (error) {
    console.error("❌ Error toggling franchisecomponyinfo status:", error);
    return res.status(500).json({
      message: "Internal server error while updating status.",
      error: error.message,
    });
  }
};
