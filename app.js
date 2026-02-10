import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import sourceRoutes from "./routes/source.routes.js";
import drivertypeRoutes from "./routes/drivertype.routes.js";
import jobtypeRoutes from "./routes/jobtype.routes.js";
import licencetypeRoutes from "./routes/licencetype.routes.js";
import vehicletypeRoutes from "./routes/vehicletype.routes.js";
import documenttypeRoutes from "./routes/documenttype.routes.js";
import countryRoutes from "./routes/country.routes.js";
import stateRoutes from "./routes/state.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import subserviceRoutes from "./routes/subservice.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import expectedsalaryRoutes from "./routes/expectedsalary.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import blogsRoutes from "./routes/blogs.routes.js";
import cmsserviceRoutes from "./routes/cmsservice.routes.js";
import adminuserRoutes from "./routes/adminuser.routes.js";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import rolepermissionRoutes from "./routes/rolepermission.routes.js";
import instagramRoutes from "./routes/instagram.routes.js";
import feedbackvedioRoutes from "./routes/feedbackvedio.routes.js";
import cmssubserviceRoutes from "./routes/cmssubservice.routes.js";
import franchiseadminsecRoutes from "./routes/franchiseadminsec.routes.js";
import franchisebankinfoRoutes from "./routes/franchisebankinfo.routes.js";
import franchisecomponyinfoRoutes from "./routes/franchisecomponyinfo.routes.js";
import franchisecontactinfoRoutes from "./routes/franchisecontactinfo.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import followupRoutes from "./routes/followup.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import relocateDriver from "./routes/relocateDriver.routes.js";
import client from "./routes/client.routes.js";
import otherapi from "./routes/otherapi.routes.js";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(morgan("dev"));

// 👉 Routes will go here

app.use("/uploads", express.static("uploads"));

// ✅ Source Routes
app.use("/api/sources", sourceRoutes);
app.use("/api/drivertype", drivertypeRoutes);
app.use("/api/jobtype", jobtypeRoutes);
app.use("/api/licencetype", licencetypeRoutes);
app.use("/api/vehicletype", vehicletypeRoutes);
app.use("/api/documenttype", documenttypeRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/state", stateRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/subservice", subserviceRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/expectedsalary", expectedsalaryRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/cmsservice", cmsserviceRoutes);
app.use("/api/adminuser", adminuserRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/rolepermission", rolepermissionRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/feedbackvedio", feedbackvedioRoutes);
app.use("/api/cmssubservice", cmssubserviceRoutes);
app.use("/api/franchiseadminsec", franchiseadminsecRoutes);
app.use("/api/franchisebankinfo", franchisebankinfoRoutes);
app.use("/api/franchisecomponyinfo", franchisecomponyinfoRoutes);
app.use("/api/franchisecontactinfo", franchisecontactinfoRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/followup", followupRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/relocatedriver", relocateDriver);
app.use("/api/client", client);
app.use("/api/otherapi", otherapi);
// ✅ Catch-all for unknown routes (fixed)
app.use(/.*/, (req, res) => {
  res.status(400).send("OOPS!! 400 Page Not Found");
});

export default app;
