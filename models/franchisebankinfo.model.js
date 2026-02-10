import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import FranchiseContactInfo from "./franchisecontactinfo.model.js";


const franchisebankinfo = sequelize.define(
  "franchisebankinfo",
  {

    franchisecontactinfoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FranchiseContactInfo,
        key: "id",
      },
    },

   bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Bank Name must not be empty" },
        len: {
          args: [2, 100],
          msg: "Bank Name must be between 2 and 100 characters",
        },
      },
    },

    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Branch Name is required" },
      },
    },

   account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Account Holder Name is required" },
      },
    },

    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "IFSC Code is required" },
      },
    },

    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        notEmpty: { msg: "Account Number is required" },
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Currency is required" },
      },
    }
  }
);

// 🧩 Associations
franchisebankinfo.belongsTo(FranchiseContactInfo, {
  foreignKey: "franchisecontactinfoId",
  as: "franchisecontactinfo",
});

FranchiseContactInfo.hasMany(franchisebankinfo, {
  foreignKey: "franchisecontactinfoId",
  as: "franchiseBanks",
});

export default franchisebankinfo;
