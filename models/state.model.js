// models/state.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import Country from "./country.model.js"; // ⬅️ import Country model

const state = sequelize.define("state", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
  // ⬇️ Foreign key (like MongoDB ObjectId ref)
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Country,
      key: "id",
    },
  },
});

// ⬇️ Associations (must be added after model definition)
state.belongsTo(Country, {
  foreignKey: "countryId",
  as: "country",
});

Country.hasMany(state, {
  foreignKey: "countryId",
  as: "states",
});

export default state;
