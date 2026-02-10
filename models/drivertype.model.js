import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const drivertype = sequelize.define("drivertype", {
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

export default drivertype;
