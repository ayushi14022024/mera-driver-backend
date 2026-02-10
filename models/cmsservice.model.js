import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const cmsservice = sequelize.define("cmsservice", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name must not be empty" },
      len: {
        args: [2, 100],
        msg: "Name must be between 2 and 100 characters",
      },
    },
  },
  details: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Details are required" },
      len: {
        args: [10, 1000],
        msg: "Details must be between 10 and 1000 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    // validate: {
    //   notEmpty: { msg: "Profile picture URL is required" },
    //   isUrl: { msg: "Profile picture must be a valid URL" },
    // },
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

export default cmsservice;
