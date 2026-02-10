import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";

const feedbackvedio = sequelize.define("feedbackvedio", {
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    youTubeLink: {
        type: DataTypes.STRING,
        allowNull: true,
        required:true
    },
    metaTag: {
        type: DataTypes.STRING,
        allowNull: true,
        required:true
    },
    metaDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        required:true
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
    }
});

export default feedbackvedio;