 
import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import driver from "./driver.model.js";
 
const driverEducation = sequelize.define("driverEducation", {
  qualification: DataTypes.STRING,
  passingYear: DataTypes.INTEGER,
  otherCertifications: DataTypes.STRING,
  marksheet: DataTypes.STRING,
  certificate: DataTypes.STRING,
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: driver,
      key: "id",
    },
  },
});
 
// // Relationship
// driver.hasMany(driverEducation, {
//   foreignKey: "driverId",
//   as: "driverEducation",
// });
// driverEducation.belongsTo(driver, {
//   foreignKey: "driverId",
// });
 
export default driverEducation;
 
 
 
 