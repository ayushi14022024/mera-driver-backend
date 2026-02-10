import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import driver from "./driver.model.js";
 
const driverPayment = sequelize.define("driverPayment", {
  bankName: DataTypes.STRING,
  bankBranch: DataTypes.STRING,
  accountHolderName: DataTypes.STRING,
  accountNumber: DataTypes.STRING,
  ifscCode: DataTypes.STRING,
  accountType: DataTypes.STRING,
  bankPassbook: DataTypes.STRING,
   QRImage: DataTypes.STRING,
    upiNumber: DataTypes.STRING,
});
 
// driver.hasOne(driverPayment, { onDelete: "CASCADE" });
// driverPayment.belongsTo(driver);
 
export default driverPayment;