import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import FranchiseComponyInfo from "./franchisecomponyinfo.model.js";

import Country from "./country.model.js";
import State from "./state.model.js";

const franchisecontactinfo = sequelize.define(
  "franchisecontactinfo",
  {


    franchisecomponyinfoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FranchiseComponyInfo,
        key: "id",
      },
    },

    business_name: {
      type: DataTypes.STRING,
      allowNull: true,
       defaultValue:""
      // validate: {
      //   notEmpty: { msg: "Business Name must not be empty" },
      //   len: {
      //     args: [2, 100],
      //     msg: "Business Name must be between 2 and 100 characters",
      //   },
      // },
    },

    legal_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Legal First Name is required" },
      },
    },

    legal_last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    defaultValue:""
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
      },
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:""
    },

   countryId: {
  type: DataTypes.INTEGER,
  allowNull: true,
    defaultValue: null,
  references: {
    model: Country,
    key: "id",
  }
},


    stateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: State,
        key: "id",
      },
       defaultValue:null
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
     defaultValue:""
    },

    zip: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:""
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Phone is required" },
      },
    },

    skype_link: {
      type: DataTypes.STRING,
      allowNull: true,
       defaultValue:""
      // validate: {
      //   notEmpty: { msg: "Skype link is required" },
      //   isUrl: { msg: "Skype link must be a valid URL" },
      // },
    },

    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true,
    defaultValue:""
    },
  },
 
);

// 🧩 Associations
franchisecontactinfo.belongsTo(FranchiseComponyInfo, {
  foreignKey: "franchisecomponyinfoId",
  as: "franchisecomponyinfo",
});

FranchiseComponyInfo.hasMany(franchisecontactinfo, {
  foreignKey: "franchisecomponyinfoId", 
  as: "franchiseContacts",
});

franchisecontactinfo.belongsTo(Country, {
  foreignKey: "countryId",
  as: "country",
});

Country.hasMany(franchisecontactinfo, {
  foreignKey: "countryId",
  as: "franchiseContacts",
});

franchisecontactinfo.belongsTo(State, {
  foreignKey: "stateId",
  as: "state",
});

State.hasMany(franchisecontactinfo, {
  foreignKey: "stateId",
  as: "franchiseContacts",
});


export default franchisecontactinfo;
