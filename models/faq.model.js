import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const faq = sequelize.define("faq", {
  qustion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

export default faq;
