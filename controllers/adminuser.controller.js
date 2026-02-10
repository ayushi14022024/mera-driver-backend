import adminuser from "../models/adminuser.model.js";
import RolePermission from "../models/rolepermission.model.js";
import Role from "../models/role.model.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import franchiseadminsec from "../models/franchiseadminsec.model.js";
import FranchiseBankInfo from "../models/franchisebankinfo.model.js";
import FranchiseContactInfo from "../models/franchisecontactinfo.model.js";
import FranchiseComponyInfo from "../models/franchisecomponyinfo.model.js";
import relocateDriver from "../models/relocateDriver.model.js";
import dotenv from "dotenv";
dotenv.config();

export const loginadminuser = async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;

    if ((!email && !phone_number) || !password) {
      return res.status(400).json({ message: "Email/Phone & Password required" });
    }

    // ✅ Build dynamic where condition
    const whereCondition = {};
    if (email) {
      whereCondition.email = email;
    } else if (phone_number) {
      whereCondition.phone_number = phone_number;
    }

    // ✅ Find user (do not filter by password directly)
    const existingAdminUser = await adminuser.findOne({
      where: whereCondition,
      include: [
        {
          model: RolePermission,
          as: "rolepermission",
          required: false,
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!existingAdminUser) {
      return res.status(400).json({ message: "Admin Not Exist." });
    }

    if (existingAdminUser.status === "inactive") {
      return res.status(400).json({ message: "Admin User is inactive" });
    }

    console.log(password, "password..............");
    console.log(existingAdminUser.password, "existingAdminUser.password..............");
    let isPasswordMatch = false;

    // if (existingAdminUser.password.startsWith("$2") && !password.startsWith("$2")) {
    //   console.log("password is number but existing password is binary....");
    //  // yaha pr password ka compair hoga showpassword se
    //   } 
    // if (!existingAdminUser.password.startsWith("$2") && password.startsWith("$2")) {
    //   console.log("password is binary but existing password is number....");
    // //no solution
    //   } 
    if (password.startsWith("$2") && existingAdminUser.password.startsWith("$2")) {
      console.log("both password and existing password is binary....");
      isPasswordMatch = password === existingAdminUser.password;
    }
    else {
      console.log(" both password and existing password is number....");
      isPasswordMatch = password === existingAdminUser.password;
    }

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password not Match." });
    }


    // ✅ Generate JWT Token
    const token = jwt.sign(
      {
        id: existingAdminUser.id,
        email: existingAdminUser.email,
        role: existingAdminUser.rolepermission?.role?.name || "N/A",
      },
      process.env.JWT_SECRET || "skylabs-secret-key-2025",
      { expiresIn: "7d" }
    );

    // ✅ Save token to DB
    await existingAdminUser.update({ token });

    res.status(200).json({
      message: "✅ Login successful",
      data: existingAdminUser,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// export const createadminuser = async (req, res) => {
//   try {
//     const { name, email, phone_number, password, rolepermissionId, status } = req.body;
// console.log(req.body);

//     // Check for duplicate email
//     const existingEmail = await adminuser.findOne({ where: { email } });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Check for duplicate phone number
//     const existingPhone = await adminuser.findOne({ where: { phone_number } });
//     if (existingPhone) {
//       return res.status(400).json({ message: "Phone number already exists" });
//     }

//    if (rolepermissionId) {
//       const roleDetails = await RolePermission.findByPk(rolepermissionId, {
//         include: { model: Role, as: "role" }
//       });

//       if (roleDetails && roleDetails.role.name === "Super Admin") {

//         const alreadySuperAdmin = await adminuser.findOne({
//           where: {
//             rolepermissionId
//           }
//         });

//         if (alreadySuperAdmin) {
//           return res.status(400).json({
//             message: "Only one Super Admin is allowed",
//           });
//         }
//       }
//     }

//     const newadminuser = await adminuser.create({
//       name,
//       email,
//       phone_number,
//       password,
//       rolepermissionId,
//       status: status || "active",
//     });

//     const populated = await adminuser.findByPk(newadminuser.id, {
//       include: {
//         model: RolePermission,
//         as: "rolepermission",
//          where: { status: "active" },
//           include: [
//                 {
//                   model: Role,
//                   as: "role",
//                 }
//               ],
//       },
//     });

//     res
//       .status(201)
//       .json({ message: "adminuser created successfully", data: populated });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const createadminuser = async (req, res) => {
  try {
    const { name, email, phone_number, password, rolepermissionId, status } = req.body;

    if (!name || !email || !phone_number || !password) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const roleDetails = await RolePermission.findByPk(rolepermissionId, {
      include: { model: Role, as: "role" },
    });

    if (!roleDetails) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // ✅ Duplicate validations
    const duplicateEmail = await adminuser.findOne({ where: { email } });
    if (duplicateEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const duplicatePhone = await adminuser.findOne({ where: { phone_number } });
    if (duplicatePhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // ✅ Restrict to single Super Admin
    if (roleDetails.role.name === "Super Admin") {
      const alreadySuperAdmin = await adminuser.findOne({
        where: { rolepermissionId },
      });

      if (alreadySuperAdmin) {
        return res.status(400).json({ message: "Only one Super Admin is allowed" });
      }
    }

    // ✅ Franchise specific validations
    if (roleDetails.role.name === "Franchise") {
      const duplicateFranchiseEmail = await FranchiseComponyInfo.findOne({
        where: { email },
      });

      if (duplicateFranchiseEmail) {
        return res.status(400).json({ message: "Franchise email already exists" });
      }

      const duplicateFranchisePhone = await FranchiseContactInfo.findOne({
        where: { phone: phone_number },
      });

      if (duplicateFranchisePhone) {
        return res.status(400).json({ message: "Franchise phone already exists" });
      }
    }


    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;
    // ✅ Create Admin User
    const newAdmin = await adminuser.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      rolepermissionId,
      status: status || "active",
    });

    // ✅ Create Franchise Related Data Automatically
    if (roleDetails.role.name === "Franchise") {
      const franchiseCompany = await FranchiseComponyInfo.create({
        adminuserId: newAdmin.id,
        email,
        status: "active",
      });

      await FranchiseContactInfo.create({
        franchisecomponyinfoId: franchiseCompany.id,
        legal_first_name: name,
        password: hashedPassword,
        phone: phone_number,
      });
    }


    // ✅ Generate and save JWT token
    const token = jwt.sign(
      {
        id: newAdmin.id,
        email: newAdmin.email,
        role: roleDetails.role.name,
      },
      process.env.JWT_SECRET || "skylabs-secret-key-2025",
      { expiresIn: "7d" }
    );
    await newAdmin.update({ token });

    const populated = await adminuser.findByPk(newAdmin.id, {
      include: {
        model: RolePermission,
        as: "rolepermission",
        include: [{ model: Role, as: "role" }],
      },
    });

    res.status(201).json({
      message: "Admin user created successfully",
      data: populated,
      token, // still return it in response
    });

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// export const updateadminuser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, phone_number, password, rolepermissionId, status } = req.body || {};

//     if (!name) {
//       return res.status(400).json({ message: "Name is required" });
//     }

//     const adminuserdata = await adminuser.findByPk(id);
//     if (!adminuserdata)
//       return res.status(404).json({ message: "adminuser not found" });

//     // Check duplicate email (excluding current record)
//     if (email) {
//       const existingEmail = await adminuser.findOne({
//         where: { email, id: { [Op.ne]: id } },
//       });
//       if (existingEmail) {
//         return res.status(400).json({ message: "Email already exists" });
//       }
//     }

//     // Check duplicate phone (excluding current record)
//     if (phone_number) {
//       const existingPhone = await adminuser.findOne({
//         where: { phone_number, id: { [Op.ne]: id } },
//       });
//       if (existingPhone) {
//         return res.status(400).json({ message: "Phone number already exists" });
//       }
//     }

//      if (rolepermissionId) {
//       const roleDetails = await RolePermission.findByPk(rolepermissionId, {
//         include: { model: Role, as: "role" }
//       });

//       if (roleDetails && roleDetails.role.name === "Super Admin") {

//         const alreadySuperAdmin = await adminuser.findOne({
//           where: {
//             rolepermissionId,
//             id: { [Op.ne]: id }
//           }
//         });

//         if (alreadySuperAdmin) {
//           return res.status(400).json({
//             message: "Only one Super Admin is allowed",
//           });
//         }
//       }
//     }
//     await adminuserdata.update({
//       name,
//       email,
//       phone_number,
//       password,
//       rolepermissionId,
//       status,
//     });

//     const updated = await adminuser.findByPk(id, {
//       include: {
//         model: RolePermission,
//         as: "rolepermission",
//          where: { status: "active" },
//           include: [
//                 {
//                   model: Role,
//                   as: "role",
//                 }
//               ],
//       },
//     });

//     res
//       .status(200)
//       .json({ message: "adminuser updated successfully", data: updated });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// 📄 Get All adminusers


export const updateadminuser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, password, rolepermissionId, status } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const adminData = await adminuser.findByPk(id);
    if (!adminData) return res.status(404).json({ message: "Admin user not found" });

    // ✅ Email Duplication Check
    if (email) {
      const duplicateEmail = await adminuser.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (duplicateEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // ✅ Phone Duplication Check
    if (phone_number) {
      const duplicatePhone = await adminuser.findOne({
        where: { phone_number, id: { [Op.ne]: id } },
      });
      if (duplicatePhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    // ✅ Validate role
    const roleDetails = await RolePermission.findByPk(rolepermissionId, {
      include: { model: Role, as: "role" },
    });

    if (!roleDetails)
      return res.status(400).json({ message: "Invalid role selected" });

    // ✅ Ensure Only One Super Admin
    if (roleDetails.role.name === "Super Admin") {
      const existingSuperAdmin = await adminuser.findOne({
        where: { rolepermissionId, id: { [Op.ne]: id } },
      });
      if (existingSuperAdmin) {
        return res.status(400).json({ message: "Only one Super Admin is allowed" });
      }
    }

    // ✅ Franchise Role - Fetch Related Data
    let franchiseCompany = null;
    let franchiseContact = null;

    if (roleDetails.role.name === "Franchise") {
      franchiseCompany = await FranchiseComponyInfo.findOne({
        where: { adminuserId: id },
      });

      if (franchiseCompany) {
        franchiseContact = await FranchiseContactInfo.findOne({
          where: { franchisecomponyinfoId: franchiseCompany.id },
        });
      }

      // ✅ Franchise Email Conflict
      const duplicateFranchiseEmail = await FranchiseComponyInfo.findOne({
        where: {
          email,
          id: { [Op.ne]: franchiseCompany?.id || null },
        },
      });
      if (duplicateFranchiseEmail) {
        return res.status(400).json({ message: "Franchise email already exists" });
      }

      // ✅ Franchise Phone Conflict
      const duplicateFranchisePhone = await FranchiseContactInfo.findOne({
        where: {
          phone: phone_number,
          id: { [Op.ne]: franchiseContact?.id || null },
        },
      });
      if (duplicateFranchisePhone) {
        return res.status(400).json({ message: "Franchise phone already exists" });
      }
    }


    let updatedPassword = adminData.password;
    if (password) {
      // updatedPassword = await bcrypt.hash(password, 10);
      updatedPassword = password;
    }
    // ✅ Update Admin User
    await adminData.update({
      name,
      email,
      phone_number,
      password: updatedPassword,
      rolepermissionId,
      status,
    });

    // ✅ Franchise Data Update OR Create
    if (roleDetails.role.name === "Franchise") {
      if (!franchiseCompany) {
        // ✅ Create Company if Missing
        franchiseCompany = await FranchiseComponyInfo.create({
          adminuserId: adminData.id,
          email,
          status: "active",
        });
      } else {
        await franchiseCompany.update({
          email,
          status: "active",
        });
      }

      if (!franchiseContact) {
        // ✅ Create Contact if Missing
        await FranchiseContactInfo.create({
          franchisecomponyinfoId: franchiseCompany.id,
          legal_first_name: name,
          phone: phone_number,
          password: updatedPassword,
        });
      } else {
        await franchiseContact.update({
          legal_first_name: name,
          phone: phone_number,
          password: updatedPassword,
        });
      }
    }

    const token = jwt.sign(
      {
        id: adminData.id,
        email: email || adminData.email,
        role: roleDetails.role.name,
      },
      process.env.JWT_SECRET || "skylabs-secret-key-2025",
      { expiresIn: "7d" }
    );

    // ✅ Save new token in DB
    await adminData.update({ token });

    // ✅ Fetch updated data
    const updatedUser = await adminuser.findByPk(id, {
      include: {
        model: RolePermission,
        as: "rolepermission",
        include: [{ model: Role, as: "role" }],
      },
    });

    res.status(200).json({
      message: "Admin user updated successfully",
      data: updatedUser,
      token, // return token for frontend usage
    });

  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAlladminusers = async (req, res) => {
  try {
    const adminusers = await adminuser.findAll(
      {
        include: [
          {
            model: RolePermission, as: "rolepermission",
            include: [
              {
                model: Role,
                as: "role",
              }
            ],
          }
        ],
      }
    );
    res.status(200).json(adminusers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const adminusers = await adminuser.findAll({
      where: { status: "active" },
      include: {
        model: RolePermission,
        as: "rolepermission",
        where: { status: "active" },
        include: [
          {
            model: Role,
            as: "role",
          }
        ],
      },
    });

    res.status(200).json(adminusers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlladminuserByrolepermissionId = async (req, res) => {
  try {
    const { rolepermissionId } = req.query;

    const filters = {};
    if (rolepermissionId) filters.rolepermissionId = rolepermissionId;

    const adminuserdata = await adminuser.findAll({
      where: {
        status: "active",
        ...filters,
      },
      include: [
        {
          model: RolePermission, as: "rolepermission",
          where: { status: "active" },
          include: [
            {
              model: Role,
              as: "role",
            }
          ],
        }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(adminuserdata);
  } catch (error) {
    console.error("Error fetching adminuser infos:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getadminuserById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminuserdata = await adminuser.findByPk(id,
      {
        include: {
          model: RolePermission,
          as: "rolepermission",
          where: { status: "active" },
          include: [
            {
              model: Role,
              as: "role",
            }
          ],
        }
      }
    );
    if (!adminuserdata) return res.status(404).json({ message: "adminuser not found" });
    res.status(200).json(adminuserdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteadminuser = async (req, res) => {
  try {
    const { id } = req.params;

    const adminuserdata = await adminuser.findByPk(id);
    if (!adminuserdata) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const deleteFranchiseCompony = await FranchiseComponyInfo.findOne({
      where: { adminuserId: id },
    });

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

    await relocateDriver.destroy({
      where: { adminUserId: id }
    });

    await adminuserdata.destroy();

    res.status(200).json({ message: "Admin user deleted successfully" });

  } catch (error) {
    console.error("Delete Error =>", error);
    res.status(500).json({ error: error.message });
  }
};

export const statusToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 🔹 Validate status value
    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      });
    }

    const updatedStatus = status.toLowerCase();

    // 🔹 Check if adminuser exists
    const adminuserdata = await adminuser.findByPk(id, {
      include: {
        model: RolePermission,
        as: "rolepermission",
        include: [
          {
            model: Role,
            as: "role",
          },
        ],
      },
    });

    if (!adminuserdata) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    // 🔹 If role = Franchise → also update franchise table
    const roleName = adminuserdata?.rolepermission?.role?.name;

    if (roleName && roleName.toLowerCase() === "franchise") {

      const FranchiseContact = await FranchiseContactInfo.findOne({
        where: {
          // email: adminuserdata?.email,
          phone: adminuserdata?.phone_number,
        },
      });

      if (FranchiseContact) {
        const FranchiseCompony = await FranchiseComponyInfo.findOne({
          where: {
            email: adminuserdata?.email,
            id: FranchiseContact?.franchisecomponyinfoId,
          },
        });
        await FranchiseCompony.update({ status: updatedStatus });

      }
    }

    // 🔹 Update admin user status
    await adminuserdata.update({ status: updatedStatus });

    return res.status(200).json({
      message: `Admin user status updated to '${updatedStatus}'.`,
      data: adminuserdata,
    });

  } catch (error) {
    console.error("❌ Error toggling adminuser status:", error);
    return res.status(500).json({
      message: "Internal server error while updating adminuser status.",
      error: error.message,
    });
  }
};

