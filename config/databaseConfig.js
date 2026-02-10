import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mera_driver", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

export { sequelize, connectDB };
