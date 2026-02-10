// models/paymentLink.model.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/databaseConfig.js";
 
const PaymentLink = sequelize.define("PaymentLink", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount:{
     type: DataTypes.FLOAT,
     allowNull: false,
  },
  status :{
     type: DataTypes.STRING,
     defaultValue: "Pending", // Pending -> Completed
  },
  qrCodeUrl: {
    type: DataTypes.STRING, // link to QR code image
    allowNull: true,
  },
  paymentUrl: {
    type: DataTypes.STRING,
    allowNull: true, // e.g., Razorpay or Stripe link
  },
  sentBy: {
    type: DataTypes.STRING, // Manager/Admin name
    allowNull: false,
  },
});
 
export default PaymentLink;
 
 