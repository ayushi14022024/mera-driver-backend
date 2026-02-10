import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const documenttype = sequelize.define("documenttype", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   details: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
});

export default documenttype;
