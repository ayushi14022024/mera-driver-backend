import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const instagram = sequelize.define("instagram", {
    url:{
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
    }
});

export default instagram;