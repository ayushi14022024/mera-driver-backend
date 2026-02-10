import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import driver from "./driver.model.js";
 
const driverDocuments = sequelize.define("driverDocuments", {
  licenseNumber: DataTypes.STRING,
  licenseExpiry: DataTypes.DATE,
  licenseCategory: DataTypes.STRING,
  aadharNumber: DataTypes.STRING,
  panNumber: DataTypes.STRING,
  passportNumber: DataTypes.STRING,
  passportExpiry: DataTypes.DATE,
  visaNumber: DataTypes.STRING,
  visaExpiry: DataTypes.DATE,
  licenseFront: DataTypes.STRING,
  licenseBack: DataTypes.STRING,
  aadharFront: DataTypes.STRING,
  aadharBack: DataTypes.STRING,
  panCard: DataTypes.STRING,
  passportImage: DataTypes.STRING,
  visaImage: DataTypes.STRING,
  policeVerification: DataTypes.STRING,
  otherDocument: DataTypes.STRING,
});
 
// driver.hasOne(driverDocuments, { onDelete: "CASCADE" });
// driverDocuments.belongsTo(driver);
 
export default driverDocuments;
 