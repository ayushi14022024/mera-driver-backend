// models/relocateDriver.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import Driver from "./driver.model.js";
import AdminUser from "./adminuser.model.js";

const RelocateDriver = sequelize.define(
  "RelocateDriver",
  {
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adminUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// RELATIONS
RelocateDriver.belongsTo(Driver, { foreignKey: "driverId", as: "driver" });
Driver.hasMany(RelocateDriver, { foreignKey: "driverId", as: "drivers" });

RelocateDriver.belongsTo(AdminUser, { foreignKey: "adminUserId", as: "adminUser" });
AdminUser.hasMany(RelocateDriver, { foreignKey: "adminUserId", as: "adminusers" });

export default RelocateDriver;
