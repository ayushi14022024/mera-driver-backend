import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const country = sequelize.define("country", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

export default country;
