import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import driver from "./driver.model.js";
 
const familyRelations = sequelize.define("familyRelations", {
  relation: DataTypes.STRING,
  name: DataTypes.STRING,
  contact: DataTypes.STRING,
  age: DataTypes.INTEGER,
});
 
// driver.hasMany(familyRelations, { onDelete: "CASCADE" });
// familyRelations.belongsTo(driver);
 
export default familyRelations;