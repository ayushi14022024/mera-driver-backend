import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import JobType from "./jobtype.model.js";
import VehicleType from "./vehicletype.model.js";

const driverExperience = sequelize.define("driverExperience", {
  componyName: DataTypes.STRING,
   jobTypeId: {
    type: DataTypes.INTEGER,
     allowNull: true,
    defaultValue: null,
    references: {
      model: JobType,
      key: "id",
    },
  },
  vehicleTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    references: {
      model: VehicleType,
      key: "id",
    },
  },
   to_date: DataTypes.DATE,
   from_date: DataTypes.DATE,
});



driverExperience.belongsTo(JobType, {
  foreignKey: "jobTypeId",
  as: "jobtype",
});

JobType.hasMany(driverExperience, {
  foreignKey: "jobTypeId",
  as: "jobtypedriverexperiences",
});
driverExperience.belongsTo(VehicleType, {
  foreignKey: "vehicleTypeId",
  as: "vehicletype",
});

VehicleType.hasMany(driverExperience, {
  foreignKey: "vehicleTypeId",
  as: "vehicletypedriverexperiences",
});


export default driverExperience;