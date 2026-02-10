import { DataTypes } from "sequelize";
 import { sequelize } from "../config/databaseConfig.js";
 import ServiceMaster from "./service.model.js"; 
 import SubServiceMaster from "./subservice.model.js"; 

const followup = sequelize.define("followup", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driverId: { type: DataTypes.INTEGER, allowNull: false },
    nextCallDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    comments: { type: DataTypes.TEXT },
    serviceId:  {
    type: DataTypes.INTEGER,
     allowNull: true,
    references: {
      model: ServiceMaster,
      key: "id",
    },
      defaultValue: null,
  },
    subServiceId:  {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SubServiceMaster,
      key: "id",
    },
      defaultValue: null,
  },
    amount: { type: DataTypes.FLOAT },
    discount: { type: DataTypes.STRING },
    discountValue: { type: DataTypes.FLOAT },
    paymentMode: { type: DataTypes.STRING },
}, {
    timestamps: true, // Use built-in timestamps
});
 

followup.belongsTo(ServiceMaster, {
  foreignKey: "serviceId",
  as: "service",
});

ServiceMaster.hasMany(followup, {
  foreignKey: "serviceId",
  as: "servicefollowup",
});

followup.belongsTo(SubServiceMaster, {
  foreignKey: "subServiceId",
  as: "subservice",
});

SubServiceMaster.hasMany(followup, {
  foreignKey: "subServiceId",
  as: "subservicefollowup",
});
 
export default followup;
 