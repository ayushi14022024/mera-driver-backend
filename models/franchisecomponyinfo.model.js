import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import AdminUser from "./adminuser.model.js";

const franchisecomponyinfo = sequelize.define("franchisecomponyinfo", {
    
 adminuserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AdminUser,
        key: "id",
      },
    },
  compony_name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:""
   
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Email is required" }
    },
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  defaultValue:""
  },
  facebook_link: {
    type: DataTypes.STRING,
    allowNull: true,
     defaultValue:""
    // validate: {
    //   notEmpty: { msg: "Facebook link is required" },
    //   isUrl: { msg: "Facebook link must be a valid URL" },
    // },
  },
    instagram_link: {
    type: DataTypes.STRING,
    allowNull: true,
     defaultValue:""
    // validate: {
    //   notEmpty: { msg: "Instagram link is required" },
    //   isUrl: { msg: "Instagram link must be a valid URL" },
    // },
  },
   twitter_link: {
    type: DataTypes.STRING,
    allowNull: true,
     defaultValue:""
    // validate: {
    //   notEmpty: { msg: "Twitter link is required" },
    //   isUrl: { msg: "Twitter link must be a valid URL" },
    // },
  },
   linkedin_link: {
    type: DataTypes.STRING,
    allowNull: true,
     defaultValue:""
    // validate: {
    //   notEmpty: { msg: "Linkedin link is required" },
    //   isUrl: { msg: "Linkedin link must be a valid URL" },
    // },
  },
  compony_logo: {
    type: DataTypes.STRING,
    allowNull: true,
     defaultValue:""
  },
  business_certificate: {
    type: DataTypes.STRING,
    allowNull: true,
     defaultValue:""
  },
    status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: true,
    defaultValue: "active",
    validate: {
      isIn: {
        args: [["active", "inactive"]],
        msg: "Status must be either 'active' or 'inactive'",
      },
    },
  },
});

franchisecomponyinfo.belongsTo(AdminUser, {
  foreignKey: "adminuserId",
  as: "adminuser",
});

AdminUser.hasMany(franchisecomponyinfo, {
  foreignKey: "adminuserId",
  as: "franchiseComponys",
});


export default franchisecomponyinfo;
