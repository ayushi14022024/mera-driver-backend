// models/payment.model.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/databaseConfig.js";
 
const Payment = sequelize.define("Payment", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.STRING,
    allowNull: false, // "Cash" or "Online"
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending", // Pending -> Completed
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
 
export default Payment;
 
 