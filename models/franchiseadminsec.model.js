import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import FranchiseBankInfo from "./franchisebankinfo.model.js";


const franchiseadminsec = sequelize.define(
  "franchiseadminsec",
  {

    franchisebankinfoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FranchiseBankInfo,
        key: "id",
      },
    },
    offer_letter: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Offer Letter is required" },
      },
    },
      commission_pay: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Commission when student pays on added program/course" },
      },
    },
      commission_payment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Commission when student makes payment for a program/course" },
      },
    },
     approve_profile: {
        type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Approve Profile is required" },
      }
    },
     status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
    }
  }
);

// 🧩 Associations
franchiseadminsec.belongsTo(FranchiseBankInfo, {
  foreignKey: "franchisebankinfoId",
  as: "franchisebankinfo",
});

FranchiseBankInfo.hasMany(franchiseadminsec, {
  foreignKey: "franchisebankinfoId",
  as: "franchiseAdmins",
});

export default franchiseadminsec;
