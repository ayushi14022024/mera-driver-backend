
import express from "express";
import { loginDriverClintByWeb, signupDriverClintByWeb ,
    signup_signin_both_DriverClintByWeb
} from "../controllers/otherapi.controller.js";
 
const router = express.Router();
 
// router.post("/clientdriversignupbyweb", signupDriverClintByWeb);    // use for login
router.post("/clientdriversignupbyweb", signup_signin_both_DriverClintByWeb);  //remove for login
router.post("/clientdriverloginbyweb", loginDriverClintByWeb);
 
export default router;