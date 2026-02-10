import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import RolePermission from "./rolepermission.model.js";

const adminuser = sequelize.define("adminuser", {
  name: {
    type: DataTypes.STRING,
      allowNull: true,
    defaultValue:"",
   
  },
  email: {
    type: DataTypes.STRING,
       allowNull: true,
    defaultValue:"",
    unique: true,
   
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:"",
  
  },
   token: {
    type: DataTypes.STRING,
      allowNull: true,
    defaultValue:""
    
  },
  rolepermissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RolePermission,
      key: "id",
    },
  },
  password: {
    type: DataTypes.STRING,
       allowNull: true,
    defaultValue:"",
    
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
    validate: {
      isIn: {
        args: [["active", "inactive"]],
        msg: "Status must be either 'active' or 'inactive'",
      },
    },
  },
});

adminuser.belongsTo(RolePermission, {
  foreignKey: "rolepermissionId",
  as: "rolepermission",
});

RolePermission.hasMany(adminuser, {
  foreignKey: "rolepermissionId",
  as: "adminusers",
});

export default adminuser;
