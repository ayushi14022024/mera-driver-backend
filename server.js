import app from "./app.js";
import { connectDB,sequelize  } from "./config/databaseConfig.js";
import { config } from "dotenv";
import "./models/index.js"; // Import all models and sync
 
config();
 
const PORT = process.env.PORT;
 
app.listen(PORT, async () => {
  await connectDB();
  //  await sequelize.sync({ alter: true });
  sequelize.sync();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 
 