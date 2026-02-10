
import client from '../models/client.model.js';
import driver from '../models/driver.model.js';

export const loginDriverClintByWeb = async (req, res) => {
  try {
    const {role, phone,otp } = req.body;


    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    if (role == "Client") {
         const clientData = await client.findOne({ where: { phone } });

    if (clientData) {
      if (clientData.status === "inactive") {
        return res.status(403).json({
          error: "Admin has deactivated this client. Please contact admin."
        });
      }

      return res.status(200).json({
        message: "Client Login Successfully",
        userType: "client",
        data: clientData
      });
    }
    }
 
    if (role == "Driver") {
      
 const driverData = await driver.findOne({ where: { phone1: phone } });
 if (driverData) {
      if (driverData.status === "inactive") {
        return res.status(403).json({
          error: "Admin has deactivated this driver. Please contact admin."
        });
      }

      return res.status(200).json({
        message: "Driver Login Successfully",
        userType: "driver",
        data: driverData
      });
 }

    }
  
    // ---------- 3️⃣ IF NOT FOUND ----------
    return res.status(404).json({
      error: "Phone Number Not Found. Please Sign Up!"
    });

  } catch (error) {
    console.error("Error while login:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const signupDriverClintByWeb = async (req, res) => {
    try {

        const {role ,name ,phone  } = req.body;

        if (role == "Client") {
             const existsPhone = await client.findOne({ where: { phone } });
             
        if (existsPhone) {
          
              if (existsPhone.status === "inactive") {
        return res.status(403).json({
          error: "Admin has deactivated this client. Please contact admin."
        });
      }

      return res.status(403).json({
        error: `Phone: ${phone} already exist.`
      });
        }

        }
     else if (role == "Driver") {
    const driverData = await driver.findOne({ where: { phone1: phone } });
         
   if (driverData) {
      if (driverData.status === "inactive") {
        return res.status(403).json({
          error: "Admin has deactivated this driver. Please contact admin."
        });
      }

      return res.status(403).json({
         error: `Phone: ${phone} already exist.`
      });
    }
     }
  
if (role == "Client") {
    const clientData = {
            firstName :name,
            phone,
             status:"active"
               };

        // Create client
        const clientResult = await client.create(clientData);
        res.status(200).json({
            message: "client create successfully",
            data: clientResult,
        });
}
    if (role == "Driver") {
    const driverData = {
            firstName :name,
            phone1:phone,
            status:"active",
            categoryStatus:"New"
               };

        // Create driver
        const driverResult = await driver.create(driverData);
        res.status(200).json({
            message: "driver create successfully",
            data: driverResult,
        });
}
      

    } catch (error) {
        console.error("Error saving complete client data:", error);
        res.status(500).json({ error: error.message });
    }
};

export const signup_signin_both_DriverClintByWeb = async (req, res) => {
    try {

        const {role ,phone  } = req.body;

        if (role == "Client") {
             const existsPhone = await client.findOne({ where: { phone } });
             
        if (existsPhone) {
          
              if (existsPhone.status === "inactive") {
        return res.status(403).json({
          error: "Admin has deactivated this client. Please contact admin."
        });
      }
  return res.status(200).json({
        message: "Client Login Successfully",
        userType: "client",
        data: existsPhone
      });

        }

        }
     else if (role == "Driver") {
    const driverData = await driver.findOne({ where: { phone1: phone } });
         
   if (driverData) {
      if (driverData.status === "inactive") {
        return res.status(403).json({
          error: "Admin has deactivated this driver. Please contact admin."
        });
      }
       return res.status(200).json({
        message: "Driver Login Successfully",
        userType: "driver",
        data: driverData
      });
    }
     }
  
if (role == "Client") {
    const clientData = {
            phone,
             status:"active"
               };

        // Create client
        const clientResult = await client.create(clientData);
        res.status(200).json({
            message: "client create successfully",
            data: clientResult,
        });
}
    if (role == "Driver") {
    const driverData = {
            phone1:phone,
            status:"active",
            categoryStatus:"New"
               };

        // Create driver
        const driverResult = await driver.create(driverData);
        res.status(200).json({
            message: "driver create successfully",
            data: driverResult,
        });
}
      

    } catch (error) {
        console.error("Error saving complete client data:", error);
        res.status(500).json({ error: error.message });
    }
};