import { sequelize } from "../config/databaseConfig.js";
 
// 🌍 Import location models first (important for associations)
import Country from "./country.model.js";
import State from "./state.model.js";
 
// Import other models
import driver from "./driver.model.js";
import driverEducation from "./diverEducation.model.js";
import familyRelations from "./familyRelations.model.js";
import driverExperience from "./driverExperience.model.js";
import driverHealth from "./driverHealth.model.js";
import driverFamily from "./driverFamily.model.js";
import driverDocuments from "./driverDocuments.model.js";
import driverPayment from "./driverPayment.model.js";
import followup from "./followup.model.js";
 
// ================================
// 🧩 DRIVER RELATIONSHIPS
// ================================
 
// 🏫 Driver → Education (One-to-Many)
driver.hasMany(driverEducation, { foreignKey: "driverId", as: "driverEducation" });
driverEducation.belongsTo(driver, { foreignKey: "driverId" });
 
// 🩺 Driver → Health (One-to-One)
driver.hasOne(driverHealth, { foreignKey: "driverId", as: "driverHealth" });
driverHealth.belongsTo(driver, { foreignKey: "driverId" });
 
// 👨‍👩‍👧 Driver → Family (One-to-Many)
driver.hasMany(driverFamily, { foreignKey: "driverId", as: "driverFamily" });
driverFamily.belongsTo(driver, { foreignKey: "driverId" });
 
// 👨‍👩‍👧 Driver → Family Relation (One-to-Many)
driver.hasMany(familyRelations, { foreignKey: "driverId", as: "familyRelations" });
familyRelations.belongsTo(driver, { foreignKey: "driverId" });

// 👨‍👩‍👧 Driver → Experience (One-to-Many)
driver.hasMany(driverExperience, { foreignKey: "driverId", as: "driverExperience" });
driverExperience.belongsTo(driver, { foreignKey: "driverId" });

// 📄 Driver → Documents (One-to-Many)
driver.hasMany(driverDocuments, { foreignKey: "driverId", as: "driverDocuments" });
driverDocuments.belongsTo(driver, { foreignKey: "driverId" });
 
// 💰 Driver → Payment (One-to-One)
driver.hasOne(driverPayment, { foreignKey: "driverId", as: "driverPayment" });
driverPayment.belongsTo(driver, { foreignKey: "driverId" });
 
// 📞 Driver → Followup (One-to-Many)
driver.hasMany(followup, { foreignKey: "driverId", as: "followups" });
followup.belongsTo(driver, { foreignKey: "driverId" });
 
// ================================
// 📦 EXPORT ALL MODELS
// ================================
export {
  sequelize,
  Country,
  State,
  driver,
  driverEducation,
  driverHealth,
  driverFamily,
  familyRelations,
  driverExperience,
  driverDocuments,
  driverPayment,
  followup,
};
 
// ================================
// 🔁 SYNC DATABASE (Development only)
// // ================================
// (async () => {
//   try {
//     await sequelize.sync({ alter: true }); // Update schema safely
//     console.log("✅ All models synchronized successfully!");
//   } catch (error) {
//     console.error("❌ Error syncing database:", error);
//   }
// })();
 
 