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



// PORT = 5000
// DB_HOST=localhost
// DB_USER=root
// DB_PASS=1234
// DB_NAME=mikikaida
// JWT_SECRET=skylabs-secret-key-2025
// EMAIL_USER = singhshelendra70@gmail.com
// EMAIL_PASS =ddxypkerjxsapzzc
