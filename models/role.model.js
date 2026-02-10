import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const role = sequelize.define("role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

export default role;
