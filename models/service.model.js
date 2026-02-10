import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const service = sequelize.define("service", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

export default service;
