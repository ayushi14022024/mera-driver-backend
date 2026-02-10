import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const vehicletype = sequelize.define("vehicletype", {
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

export default vehicletype;
