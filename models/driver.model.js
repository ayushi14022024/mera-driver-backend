

import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import Country from "./country.model.js";
import State from "./state.model.js";
import DriverType from "./drivertype.model.js";
import Source from "./source.model.js";
import ExpectedSalary from "./expectedsalary.model.js";
import LicenseType from "./licencetype.model.js";
import JobType from "./jobtype.model.js";
import VehicleType from "./vehicletype.model.js";
const driver = sequelize.define("driver", {
  firstName: { type: DataTypes.STRING },
  middleName: DataTypes.STRING,
  lastName: { type: DataTypes.STRING},
  profilePhoto: DataTypes.STRING,
  email: { type: DataTypes.STRING },
  phone1: { type: DataTypes.STRING, allowNull: false },
  phone2: DataTypes.STRING,
  dob: DataTypes.DATE,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  smoking: DataTypes.STRING,
  color: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  bodyType: DataTypes.STRING,
  totalExperience: DataTypes.STRING,
  nationality: DataTypes.STRING,
  religion: DataTypes.STRING,
  status: DataTypes.STRING,
  categoryStatus: DataTypes.STRING,
  currentSalary: DataTypes.STRING,

  expectedSalaryId: {
    type: DataTypes.INTEGER,
     allowNull: true,
    defaultValue: null,
    references: {
      model: ExpectedSalary,
      key: "id",
    },
  },
  // jobTypeId: {
  //   type: DataTypes.INTEGER,
  //    allowNull: true,
  //   defaultValue: null,
  //   references: {
  //     model: JobType,
  //     key: "id",
  //   },
  // },
  // vehicleTypeId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   defaultValue: null,
  //   references: {
  //     model: VehicleType,
  //     key: "id",
  //   },
  // },
  licenseTypeId: {
    type: DataTypes.INTEGER,
     allowNull: true,
    defaultValue: null,
    references: {
      model: LicenseType,
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
  // Current Address
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

  // Permanent Address
  permanentHouse: DataTypes.STRING,
  permanentStreet: DataTypes.STRING,
  permanentLandmark: DataTypes.STRING,
  permanentCity: DataTypes.STRING,
  permanentPincode: DataTypes.STRING,
  permanentStateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    references: {
      model: State,
      key: "id",
    },
  },
  permanentCountryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    references: {
      model: Country,
      key: "id",
    },
  },
});


driver.belongsTo(Country, {
  foreignKey: "countryId",
  as: "country",
});

Country.hasMany(driver, {
  foreignKey: "countryId",
  as: "countrydrivers",
});

driver.belongsTo(State, {
  foreignKey: "stateId",
  as: "state",
});

State.hasMany(driver, {
  foreignKey: "stateId",
  as: "statedrivers",
});

driver.belongsTo(DriverType, {
  foreignKey: "driverTypeId",
  as: "drivertype",
});

DriverType.hasMany(driver, {
  foreignKey: "driverTypeId",
  as: "drivertypedrivers",
});

driver.belongsTo(Source, {
  foreignKey: "sourceTypeId",
  as: "sourcetype",
});

Source.hasMany(driver, {
  foreignKey: "sourceTypeId",
  as: "sourcetypedrivers",
});
driver.belongsTo(ExpectedSalary, {
  foreignKey: "expectedSalaryId",
  as: "expectedsalary",
});

ExpectedSalary.hasMany(driver, {
  foreignKey: "expectedSalaryId",
  as: "expectedsalarydrivers",
});
driver.belongsTo(LicenseType, {
  foreignKey: "licenseTypeId",
  as: "licensetype",
});

LicenseType.hasMany(driver, {
  foreignKey: "licenseTypeId",
  as: "licensetypedrivers",
});


// driver.belongsTo(JobType, {
//   foreignKey: "jobTypeId",
//   as: "jobtype",
// });

// JobType.hasMany(driver, {
//   foreignKey: "jobTypeId",
//   as: "jobtypedrivers",
// });
// driver.belongsTo(VehicleType, {
//   foreignKey: "vehicleTypeId",
//   as: "vehicletype",
// });

// VehicleType.hasMany(driver, {
//   foreignKey: "vehicleTypeId",
//   as: "vehicletypedrivers",
// });


driver.belongsTo(Country, {
  foreignKey: "permanentCountryId",
  as: "permanentcountry",
});

Country.hasMany(driver, {
  foreignKey: "permanentCountryId",
  as: "permanentcountrydrivers",
});

driver.belongsTo(State, {
  foreignKey: "permanentStateId",
  as: "permanentstate",
});

State.hasMany(driver, {
  foreignKey: "permanentStateId",
  as: "permanentstatedrivers",
});
export default driver;