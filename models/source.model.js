import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const Source = sequelize.define("Source", {
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

export default Source;
