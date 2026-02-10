import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const expectedsalary = sequelize.define("expectedsalary", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   salary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

export default expectedsalary;
