

// models/role.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import Role from "./role.model.js";
import Permission from "./permission.model.js";

const rolepermission = sequelize.define(
  "rolepermission",
  {
    roleId: {
       type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    },
    },

    // ✅ JSON array storing all permissions
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
  }
);

rolepermission.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});
Role.hasMany(rolepermission, {
  foreignKey: "roleId",
  as: "rolepermissions",
});


export default rolepermission;
