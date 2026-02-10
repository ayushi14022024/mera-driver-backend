import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import driver from "./driver.model.js";
 
const driverFamily = sequelize.define("driverFamily", {
  // spouseName: DataTypes.STRING,
  numberOfChildren: DataTypes.INTEGER,
  // totalDependents: DataTypes.INTEGER,
  // familyContactNumber: DataTypes.STRING,
  familyIncome: DataTypes.STRING,
  residenceType: DataTypes.STRING,
  familyAddress: DataTypes.TEXT,
});
 
// driver.hasOne(driverFamily, { onDelete: "CASCADE" });
// driverFamily.belongsTo(driver);
 
export default driverFamily;
 