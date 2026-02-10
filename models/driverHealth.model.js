 
import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import driver from "./driver.model.js";
 
const driverHealth = sequelize.define("driverHealth", {
  bloodGroup: DataTypes.STRING,
  height: DataTypes.FLOAT,
  weight: DataTypes.FLOAT,
  medicalCondition: DataTypes.STRING,
  allergyType: DataTypes.STRING,
  regularMedication: DataTypes.STRING,
  disability: DataTypes.STRING,
  medicalCertificate: DataTypes.STRING,
  fitnessCertificate: DataTypes.STRING,
});
 
// driver.hasOne(driverHealth, { onDelete: "CASCADE" });
// driverHealth.belongsTo(driver);
 
export default driverHealth;
 