import rolepermission from "../models/rolepermission.model.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import { Op } from "sequelize";


export const createrolepermission = async (req, res) => {
  try {
    const { roleId, permissions, status } = req.body;
     const existingrole = await rolepermission.findOne({
      where: { roleId: roleId
       },
    });

    if (existingrole) {
      return res
        .status(400)
        .json({ message: "Role name already exists." });
    }

      const newrolepermission = await rolepermission.create({
      roleId,
     permissions,
      status: status || "active",
    });

    res.status(200).json({
      message: "✅ created Successfully!",
      data: newrolepermission,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✏️ Update Role Permission
export const updaterolepermission = async (req, res) => {
  try {
    const { id } = req.params;
     const { roleId, permissions, status } = req.body;

    const record = await rolepermission.findByPk(id);
    if (!record) return res.status(404).json({ message: "Role Permission not found" });

       const existingrole = await rolepermission.findOne({
      where: { roleId: roleId,
         id: { [Op.ne]: id }
       },
    });

    if (existingrole) {
      return res
        .status(400)
        .json({ message: "Role name already exists." });
    }

    await record.update({
      roleId,
     permissions,
      status,
    });

    const updated = await rolepermission.findByPk(id, {
      include: [
        { model: Role, as: "role" }
      ],
    });

    res.status(200).json({
      message: "Role Permission updated successfully",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All
export const getAllrolepermissions = async (req, res) => {
  try {
    const list = await rolepermission.findAll({
      include: [
        { model: Role, as: "role" }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(list);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Active
export const getAllActiveData = async (req, res) => {
  try {
    const list = await rolepermission.findAll({
      where: { status: "active" },
      include: [
        { model: Role, as: "role", where: { status: "active" } }
      ],
    });

    res.status(200).json(list);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get By Filters (roleId / permissionId)
export const getrolepermissionsByFilter = async (req, res) => {
  try {
    const { roleId, permissionId, rolename } = req.query;

    const filters = {};
    if (roleId) filters.roleId = roleId;
    if (permissionId) filters.permissions.permissionId = permissionId;

    const list = await rolepermission.findAll({
      where: { status: "active", ...filters },
      include: [{ model: Role, as: "role" }],
      order: [["id", "DESC"]],
    });

    if (rolename) {
      const rolenamelist = await rolepermission.findAll({
        where: filters,
        include: [
          {
            model: Role,
            as: "role",
            where: { name: rolename },
            required: true,
          },
        ],
        order: [["id", "DESC"]],
      });

      return res.status(200).json(rolenamelist);  // ✅ return added
    }

    return res.status(200).json(list); // ✅ return

  } catch (error) {
    return res.status(500).json({ error: error.message }); // optional return
  }
};


// 🔍 Get By ID
export const getrolepermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const found = await rolepermission.findByPk(id, {
      include: [
        { model: Role, as: "role" },
      ],
    });

    if (!found) return res.status(404).json({ message: "Role Permission not found" });

    res.status(200).json(found);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete
export const deleterolepermission = async (req, res) => {
  try {
    const { id } = req.params;

    const found = await rolepermission.findByPk(id);
    if (!found) return res.status(404).json({ message: "Role Permission not found" });

    await found.destroy();

    res.status(200).json({ message: "Role Permission deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 Status Toggle
export const statusToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status?.toLowerCase())) {
      return res.status(400).json({ message: "Status must be active/inactive" });
    }

    const found = await rolepermission.findByPk(id);
    if (!found) return res.status(404).json({ message: "Role Permission not found" });

    await found.update({ status });

    res.status(200).json({
      message: `Role Permission status updated to ${status}`,
      data: found,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



