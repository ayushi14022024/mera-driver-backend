import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const licencetype = sequelize.define("licencetype", {
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

export default licencetype;
