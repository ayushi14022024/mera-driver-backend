import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const testimonial = sequelize.define("testimonial", {
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
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Designation is required" },
      len: {
        args: [2, 100],
        msg: "Designation must be between 2 and 100 characters",
      },
    },
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Location is required" },
      len: {
        args: [2, 100],
        msg: "Location must be between 2 and 100 characters",
      },
    },
  },
  review_link: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Review link is required" },
      isUrl: { msg: "Review link must be a valid URL" },
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
  profile_pic: {
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

export default testimonial;
