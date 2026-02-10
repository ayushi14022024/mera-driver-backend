import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const blogs = sequelize.define("blogs", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Title must not be empty" }
    },
  },
   alt_tag: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Alt Tag must not be empty" }
    },
  },

  meta_tags: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Meta tags are required" },
      len: {
        args: [2, 255],
        msg: "Meta tags must be between 2 and 255 characters",
      },
    },
  },
  meta_description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Meta description is required" },
      len: {
        args: [10, 255],
        msg: "Meta description must be between 10 and 255 characters",
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
    allowNull: false
    
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

export default blogs;
