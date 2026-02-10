

import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import Country from "./country.model.js";
import State from "./state.model.js";
import DriverType from "./drivertype.model.js";
import Source from "./source.model.js";
import JobType from "./jobtype.model.js";
import VehicleType from "./vehicletype.model.js";
const client = sequelize.define("client", {
  firstName: { type: DataTypes.STRING },
  middleName: DataTypes.STRING,
  lastName: { type: DataTypes.STRING},
  profilePhoto: DataTypes.STRING,
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, allowNull: false },
  dob: DataTypes.DATE,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  nationality: DataTypes.STRING,
  religion: DataTypes.STRING,
  status: DataTypes.STRING,

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
  sourceTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    references: {
      model: Source,
      key: "id",
    },
  },
  driverTypeId: {
    type: DataTypes.INTEGER,
   allowNull: true,
    defaultValue: null,
    references: {
      model: DriverType,
      key: "id",
    },
  },
  // Address
  house: DataTypes.STRING,
  street: DataTypes.STRING,
  landmark: DataTypes.STRING,
  city: DataTypes.STRING,
  pincode: DataTypes.STRING,
  stateId: {
    type: DataTypes.INTEGER,
   allowNull: true,
    defaultValue: null,
    references: {
      model: State,
      key: "id",
    },
  },
  countryId: {
    type: DataTypes.INTEGER,
   allowNull: true,
    defaultValue: null,
    references: {
      model: Country,
      key: "id",
    },
  },

});


client.belongsTo(Country, {
  foreignKey: "countryId",
  as: "country",
});

Country.hasMany(client, {
  foreignKey: "countryId",
  as: "countryclients",
});

client.belongsTo(State, {
  foreignKey: "stateId",
  as: "state",
});

State.hasMany(client, {
  foreignKey: "stateId",
  as: "stateclients",
});

client.belongsTo(DriverType, {
  foreignKey: "driverTypeId",
  as: "drivertype",
});

DriverType.hasMany(client, {
  foreignKey: "driverTypeId",
  as: "drivertypeclients",
});

client.belongsTo(Source, {
  foreignKey: "sourceTypeId",
  as: "sourcetype",
});

Source.hasMany(client, {
  foreignKey: "sourceTypeId",
  as: "sourcetypeclients",
});

client.belongsTo(JobType, {
  foreignKey: "jobTypeId",
  as: "jobtype",
});

JobType.hasMany(client, {
  foreignKey: "jobTypeId",
  as: "jobtypeclients",
});

client.belongsTo(VehicleType, {
  foreignKey: "vehicleTypeId",
  as: "vehicletype",
});

VehicleType.hasMany(client, {
  foreignKey: "vehicleTypeId",
  as: "vehicletypeclients",
});

export default client;