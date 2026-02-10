import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import cmsservice from "./cmsservice.model.js";

const cmssubservice = sequelize.define("cmssubservice", {
   cmsserviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: cmsservice,
      key: "id",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Title must not be empty" }
    },
  },
    h1: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "h1 must not be empty" }
    },
  },
   h2: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "h2 must not be empty" }
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
   details_one: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Details One are required" },
      len: {
        args: [10, 1000],
        msg: "Details One must be between 10 and 1000 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
    image_one: {
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
cmssubservice.belongsTo(cmsservice, {
  foreignKey: "cmsserviceId",
  as: "cmsservice",
});

cmsservice.hasMany(cmssubservice, {
  foreignKey: "cmsserviceId",
  as: "cmssubservices",
});

export default cmssubservice;
