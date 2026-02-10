import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import Service from "./service.model.js"; 


const subservice = sequelize.define("subservice", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
    serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: "id",
    },
  },
});

subservice.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

Service.hasMany(subservice, {
  foreignKey: "serviceId",
  as: "subservices",
});
export default subservice;
