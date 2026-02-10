
import driver from '../models/driver.model.js';
import driverEducation from '../models/diverEducation.model.js';
import driverHealth from '../models/driverHealth.model.js';
import driverFamily from '../models/driverFamily.model.js';
import familyRelationsModel from '../models/familyRelations.model.js';
import driverExperienceModel from '../models/driverExperience.model.js';
import driverDocuments from '../models/driverDocuments.model.js';
import driverPayment from '../models/driverPayment.model.js';
import Country from '../models/country.model.js';
import State from '../models/state.model.js';
import DriverType from '../models/drivertype.model.js';
import SourceType from '../models/source.model.js';
import ExpectedSalary from '../models/expectedsalary.model.js';
import LicenseType from '../models/licencetype.model.js';
import JobType from '../models/jobtype.model.js';
import VehicleType from '../models/vehicletype.model.js';
import { Op, Sequelize } from "sequelize";
import relocateDriver from "../models/relocateDriver.model.js";
import XLSX from "xlsx";

export const saveDriverSteps = async (req, res) => {
  try {
    const {
      // Driver basic info
      sourceTypeId, driverTypeId, firstName, middleName, lastName, email,
      phone1, phone2, dob, age, gender, licenseTypeId, smoking, color,
      maritalStatus, bodyType, totalExperience,
      nationality, religion, status, categoryStatus, currentSalary, expectedSalaryId,
      driverExperience,

      // Address info
      house, street, landmark, city, stateId, pincode, countryId,
      permanentHouse, permanentStreet, permanentLandmark, permanentCity,
      permanentStateId, permanentPincode, permanentCountryId,

      // Education
      qualification, passingYear, otherCertifications,

      // Health
      bloodGroup, height, weight, medicalCondition, allergyType,
      regularMedication, disability,

      // Family
      // spouseName, 
      //  totalDependents, familyContactNumber,
      numberOfChildren,
      familyIncome, residenceType, familyAddress,
      familyRelations,

      // Documents
      licenseNumber, licenseExpiry, licenseCategory, aadharNumber,
      panNumber, passportNumber, passportExpiry, visaNumber, visaExpiry,

      // Payment
      bankName, bankBranch, accountHolderName, accountNumber, upiNumber,
      ifscCode, accountType
    } = req.body;

    let parsedRelations = [];
    let parsedExperience = [];

    try {
      parsedRelations = familyRelations
        ? JSON.parse(familyRelations)
        : [];
    } catch (err) {
      console.log("JSON parse error:", err);
    }

    try {
      parsedExperience = driverExperience
        ? JSON.parse(driverExperience)
        : [];
    } catch (err) {
      console.log("JSON parse error:", err);
    }
   
    const files = req.files || {};

    console.log("Received driver data:", req.body);
    console.log("Received files:", Object.keys(files));

    const existsPhone1 = await driver.findOne({ where: { phone1 } });
    if (existsPhone1) {
      return res.status(400).json({ message: `Phone1: ${phone1} already exist.` });
    }

    const existsEmail = await driver.findOne({ where: { email } });
    if (existsEmail) {
      return res.status(400).json({ message: `Email: ${email} already exist.` });
    }

  
    const driverData = {
      sourceTypeId,
      driverTypeId,
      firstName,
      middleName,
      lastName,
      email,
      phone1,
      phone2,
      dob,
      age,
      gender,
      licenseTypeId,
      smoking,
      color,
      maritalStatus,
      bodyType,
      totalExperience,
      nationality,
      religion,
      status: "active",
      categoryStatus: "New",
      currentSalary,
      expectedSalaryId,
      house,
      street,
      landmark,
      city,
      stateId,
      pincode,
      countryId,
      permanentHouse,
      permanentStreet,
      permanentLandmark,
      permanentCity,
      permanentStateId,
      permanentPincode,
      permanentCountryId,

      profilePhoto: files.profilePhoto ? `http://localhost:5000/${files?.profilePhoto?.[0]?.path}` : null,
    };

    // Create driver
    const driverResult = await driver.create(driverData);
    const newDriverId = driverResult.id;

    // Step 2: Save education data
    if (qualification || passingYear || otherCertifications) {
      const educationData = {
        qualification,
        passingYear: passingYear ? parseInt(passingYear) : null,
        otherCertifications,
        marksheet: files.marksheet ? `http://localhost:5000/${files?.marksheet?.[0]?.path}` : null,
        certificate: files.certificate ? `http://localhost:5000/${files?.certificate?.[0]?.path}` : null,
      };
      await driverEducation.create({ ...educationData, driverId: newDriverId });
    }

    // Step 3: Save health data
    if (bloodGroup || height || weight) {
      const healthData = {
        bloodGroup,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        medicalCondition,
        allergyType,
        regularMedication,
        disability,

        medicalCertificate: files.medicalCertificate ? `http://localhost:5000/${files?.medicalCertificate?.[0]?.path}` : null,
        fitnessCertificate: files.fitnessCertificate ? `http://localhost:5000/${files?.fitnessCertificate?.[0]?.path}` : null,
      };
      await driverHealth.create({ ...healthData, driverId: newDriverId });
    }

    // Step 4: Save family data
    if (numberOfChildren) {
      const familyData = {
        // spouseName,
        numberOfChildren: numberOfChildren ? parseInt(numberOfChildren) : null,
        // totalDependents: totalDependents ? parseInt(totalDependents) : null,
        // familyContactNumber,
        familyIncome,
        residenceType,
        familyAddress,
      };
      await driverFamily.create({ ...familyData, driverId: newDriverId });
    }

    // Step 5: Save family relations
    if (Array.isArray(parsedRelations) && parsedRelations.length > 0) {
      console.log(Array.isArray(parsedRelations), parsedRelations.length, "family relation length............ ");
      await familyRelationsModel.destroy({ where: { driverId: newDriverId } });

      const relationsToCreate = parsedRelations
        .filter(r => r.relation && r.name)
        .map(r => ({
          ...r,
          driverId: newDriverId,
          age: r.age ? parseInt(r.age) : null
        }));

      if (relationsToCreate.length > 0) {
        await familyRelationsModel.bulkCreate(relationsToCreate);
      }
    }

    if (Array.isArray(parsedExperience) && parsedExperience.length > 0) {
  if (totalExperience === "FRESHER") {
         await driverExperienceModel.destroy({ where: { driverId: newDriverId } });
      }

else{
  await driverExperienceModel.destroy({ where: { driverId: newDriverId } });

      const experienceToCreate = parsedExperience
        .filter(r => r.componyName)
        .map(r => ({
          ...r,
          driverId: newDriverId
        }));

      if (experienceToCreate.length > 0) {
        await driverExperienceModel.bulkCreate(experienceToCreate);
      }
}
   
    }

    // Step 6: Save documents data
    if (licenseNumber || aadharNumber || panNumber) {
      const documentsData = {
        licenseNumber,
        licenseExpiry,
        licenseCategory,
        aadharNumber,
        panNumber,
        passportNumber,
        passportExpiry,
        visaNumber,
        visaExpiry,
        licenseFront: files.licenseFront ? `http://localhost:5000/${files?.licenseFront?.[0]?.path}` : null,
        licenseBack: files.licenseBack ? `http://localhost:5000/${files?.licenseBack?.[0]?.path}` : null,
        aadharFront: files.aadharFront ? `http://localhost:5000/${files?.aadharFront?.[0]?.path}` : null,
        aadharBack: files.aadharBack ? `http://localhost:5000/${files?.aadharBack?.[0]?.path}` : null,
        panCard: files.panCard ? `http://localhost:5000/${files?.panCard?.[0]?.path}` : null,
        passportImage: files.passportImage ? `http://localhost:5000/${files?.passportImage?.[0]?.path}` : null,
        visaImage: files.visaImage ? `http://localhost:5000/${files?.visaImage?.[0]?.path}` : null,
        policeVerification: files.policeVerification ? `http://localhost:5000/${files?.policeVerification?.[0]?.path}` : null,
        otherDocument: files.otherDocument ? `http://localhost:5000/${files?.otherDocument?.[0]?.path}` : null,
      };
      await driverDocuments.create({ ...documentsData, driverId: newDriverId });
    }

    // Step 7: Save payment data
    if (bankName || accountNumber || ifscCode) {
      const paymentData = {
        bankName,
        bankBranch,
        accountHolderName,
        accountNumber,
        ifscCode,
        upiNumber,
        accountType,
        bankPassbook: files.bankPassbook ? `http://localhost:5000/${files?.bankPassbook?.[0]?.path}` : null,
        QRImage: files.QRImage ? `http://localhost:5000/${files?.QRImage?.[0]?.path}` : null,
      };
      await driverPayment.create({ ...paymentData, driverId: newDriverId });
    }

    res.status(200).json({
      message: "Complete driver data with files saved successfully across all tables",
      driverId: newDriverId,
      filesUploaded: Object.keys(files),
      data: {
        driver: "Saved with profile photo and addresses",
        education: "Saved with documents",
        health: "Saved with certificates",
        family: "Saved with relations",
        documents: "Saved with all document images",
        payment: "Saved with bank documents"
      }
    });

  } catch (error) {
    console.error("Error saving complete driver data:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDriverDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const driverInfo = await driver.findOne({
      where: { id },
      include: [
        { model: driverEducation, as: "driverEducation", required: false },
        { model: driverHealth, as: "driverHealth", required: false },
        { model: familyRelationsModel, as: "familyRelations", required: false },
        {
          model: driverExperienceModel,
          as: "driverExperience",
          required: false,
          include: [
            { model: JobType, as: "jobtype", required: false },
            { model: VehicleType, as: "vehicletype", required: false }
          ]
        },
        { model: driverFamily, as: "driverFamily", required: false },
        { model: driverDocuments, as: "driverDocuments", required: false },
        { model: driverPayment, as: "driverPayment", required: false },

        // ⭐ Active filter but still allow NULL → use required: false
        { model: Country, as: "country", required: false, where: { status: "active" } },
        { model: State, as: "state", required: false, where: { status: "active" } },
        { model: Country, as: "permanentcountry", required: false, where: { status: "active" } },
        { model: State, as: "permanentstate", required: false, where: { status: "active" } },

        { model: DriverType, as: "drivertype", required: false, where: { status: "active" } },
        { model: SourceType, as: "sourcetype", required: false, where: { status: "active" } },
        { model: ExpectedSalary, as: "expectedsalary", required: false, where: { status: "active" } },
        { model: LicenseType, as: "licensetype", required: false, where: { status: "active" } },
      ]
    });

    if (!driverInfo) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json(driverInfo);
  } catch (error) {
    console.error("❌ Error fetching driver details:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateDriverStep = async (req, res) => {
  try {
    const driverId = req.body.driverId;

    if (!driverId) {
      return res.status(400).json({ error: "Driver ID is required" });
    }

    const existingDriver = await driver.findByPk(driverId);
    if (!existingDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Extract body data
    const {
      sourceTypeId, driverTypeId, firstName, middleName, lastName, email,
      phone1, phone2, dob, age, gender, licenseTypeId, smoking, color,
      maritalStatus, bodyType, totalExperience,
      nationality, religion, status, categoryStatus, currentSalary, expectedSalaryId,
      driverExperience,

      // Address Info
      house, street, landmark, city, stateId, pincode, countryId,
      permanentHouse, permanentStreet, permanentLandmark, permanentCity,
      permanentStateId, permanentPincode, permanentCountryId,

      // Education
      qualification, passingYear, otherCertifications,

      // Health
      bloodGroup, height, weight, medicalCondition, allergyType,
      regularMedication, disability,

      // Family
      // spouseName,
      //  totalDependents, familyContactNumber,
      numberOfChildren,
      familyIncome, residenceType, familyAddress,
      familyRelations,

      // Documents
      licenseNumber, licenseExpiry, licenseCategory, aadharNumber,
      panNumber, passportNumber, passportExpiry, visaNumber, visaExpiry,

      // Payment
      bankName, bankBranch, accountHolderName, accountNumber, upiNumber,
      ifscCode, accountType
    } = req.body;


    // 1️⃣ PHONE1 UNIQUE CHECK (exclude same driver)
    if (phone1) {
      const existsPhone1 = await driver.findOne({
        where: { phone1, id: { [Op.ne]: driverId } }
      });

      if (existsPhone1) {
        return res
          .status(400)
          .json({ message: `Phone1 ${phone1} already exists.` });
      }
    }

    // 2️⃣ EMAIL UNIQUE CHECK (exclude same driver)
    if (email) {
      const existsEmail = await driver.findOne({
        where: { email, id: { [Op.ne]: driverId } }
      });

      if (existsEmail) {
        return res
          .status(400)
          .json({ message: `Email ${email} already exists.` });
      }
    }

    let parsedRelations = [];
    let parsedExperience = [];

    try {
      parsedRelations = familyRelations
        ? JSON.parse(familyRelations)
        : [];
    } catch (err) {
      console.log("JSON parse error:", err);
    }
    try {
   
        parsedExperience = driverExperience
        ? JSON.parse(driverExperience)
        : [];

    } catch (err) {
      console.log("JSON parse error:", err);
    }
    const files = req.files || {};

    // console.log("Updating driver:", driverId);
    //  console.log("Received driver data:", req.body);
    //     console.log("Received driver family Relations body data:", parsedRelations);
    // console.log("Files received:", Object.keys(files));

    // -------------------------------------------------------------------
    // 1. UPDATE DRIVER BASIC DATA
    // -------------------------------------------------------------------
    const driverUpdateData = {
      sourceTypeId,
      driverTypeId,
      firstName,
      middleName,
      lastName,
      email,
      phone1,
      phone2,
      dob,
      age,
      gender,
      licenseTypeId,
      smoking,
      color,
      maritalStatus,
      bodyType,
      totalExperience,
      nationality,
      religion,
      status,
      categoryStatus,
      currentSalary,
      expectedSalaryId,
      house,
      street,
      landmark,
      city,
      stateId,
      pincode,
      countryId,
      permanentHouse,
      permanentStreet,
      permanentLandmark,
      permanentCity,
      permanentStateId,
      permanentPincode,
      permanentCountryId,
      profilePhoto: files.profilePhoto ? `http://localhost:5000/${files?.profilePhoto?.[0]?.path}` : existingDriver.profilePhoto,
    };
    await existingDriver.update(driverUpdateData);

    // -------------------------------------------------------------------
    // 2. UPDATE EDUCATION
    // -------------------------------------------------------------------
    const existingEducation = await driverEducation.findOne({ where: { driverId } });

    if (qualification || passingYear || otherCertifications || files.marksheet || files.certificate) {
      const educationData = {
        qualification,
        passingYear: passingYear ? parseInt(passingYear) : null,
        otherCertifications,
        marksheet: files.marksheet ? `http://localhost:5000/${files?.marksheet?.[0]?.path}` : existingEducation?.marksheet,
        certificate: files.certificate ? `http://localhost:5000/${files?.certificate?.[0]?.path}` : existingEducation?.certificate,
        driverId,
      };

      if (existingEducation) {
        await existingEducation.update(educationData);
      } else {
        await driverEducation.create(educationData);
      }
    }

    // -------------------------------------------------------------------
    // 3. UPDATE HEALTH
    // -------------------------------------------------------------------
    const existingHealth = await driverHealth.findOne({ where: { driverId } });

    if (bloodGroup || height || weight || medicalCondition || files.medicalCertificate) {
      const healthData = {
        bloodGroup,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        medicalCondition,
        allergyType,
        regularMedication,
        disability,
        medicalCertificate: files.medicalCertificate ? `http://localhost:5000/${files?.medicalCertificate?.[0]?.path}` : existingHealth?.medicalCertificate,
        fitnessCertificate: files.fitnessCertificate ? `http://localhost:5000/${files?.fitnessCertificate?.[0]?.path}` : existingHealth?.fitnessCertificate,
        driverId,
      };

      if (existingHealth) {
        await existingHealth.update(healthData);
      } else {
        await driverHealth.create(healthData);
      }
    }

    // -------------------------------------------------------------------
    // 4. UPDATE FAMILY BASIC
    // -------------------------------------------------------------------
    const existingFamily = await driverFamily.findOne({ where: { driverId } });

    if (residenceType || familyAddress) {
      const familyData = {
        // spouseName,
        numberOfChildren: numberOfChildren ? parseInt(numberOfChildren) : null,
        // totalDependents: totalDependents ? parseInt(totalDependents) : null,
        // familyContactNumber,
        familyIncome,
        residenceType,
        familyAddress,
        driverId,
      };

      if (existingFamily) {

        await existingFamily.update(familyData);
      } else {
        await driverFamily.create(familyData);
      }
    }

    // -------------------------------------------------------------------
    // 5. UPDATE FAMILY RELATIONS
    // -------------------------------------------------------------------


    if (Array.isArray(parsedRelations) && parsedRelations.length > 0) {
      console.log(Array.isArray(parsedRelations), parsedRelations.length, "family relation length............ ");
      await familyRelationsModel.destroy({ where: { driverId } });

      const relationsToCreate = parsedRelations
        .filter(r => r.relation && r.name)
        .map(r => ({
          ...r,
          driverId,
          age: r.age ? parseInt(r.age) : null
        }));

      if (relationsToCreate.length > 0) {
        await familyRelationsModel.bulkCreate(relationsToCreate);
      }
    }


    if (Array.isArray(parsedExperience) && parsedExperience.length > 0) {
       if (totalExperience === "FRESHER") {
         await driverExperienceModel.destroy({ where: { driverId } });
      }
      else{
  await driverExperienceModel.destroy({ where: { driverId } });

      const experienceToCreate = parsedExperience
        .filter(r => r.componyName)
        .map(r => ({
          ...r,
          driverId
        }));

      if (experienceToCreate.length > 0) {
        await driverExperienceModel.bulkCreate(experienceToCreate);
      }
      }
     
    }
    // -------------------------------------------------------------------
    // 6. UPDATE DOCUMENTS
    // -------------------------------------------------------------------
    const existingDocs = await driverDocuments.findOne({ where: { driverId } });

    if (
      licenseNumber || aadharNumber || panNumber || files.licenseFront || files.panCard
    ) {
      const documentsData = {
        licenseNumber,
        licenseExpiry,
        licenseCategory,
        aadharNumber,
        panNumber,
        passportNumber,
        passportExpiry,
        visaNumber,
        visaExpiry,

        licenseFront: files.licenseFront ? `http://localhost:5000/${files?.licenseFront?.[0]?.path}` : existingDocs?.licenseFront,
        licenseBack: files.licenseBack ? `http://localhost:5000/${files?.licenseBack?.[0]?.path}` : existingDocs?.licenseBack,
        aadharFront: files.aadharFront ? `http://localhost:5000/${files?.aadharFront?.[0]?.path}` : existingDocs?.aadharFront,
        aadharBack: files.aadharBack ? `http://localhost:5000/${files?.aadharBack?.[0]?.path}` : existingDocs?.aadharBack,
        panCard: files.panCard ? `http://localhost:5000/${files?.panCard?.[0]?.path}` : existingDocs?.panCard,
        passportImage: files.passportImage ? `http://localhost:5000/${files?.passportImage?.[0]?.path}` : existingDocs?.passportImage,
        visaImage: files.visaImage ? `http://localhost:5000/${files?.visaImage?.[0]?.path}` : existingDocs?.visaImage,
        policeVerification: files.policeVerification ? `http://localhost:5000/${files?.policeVerification?.[0]?.path}` : existingDocs?.policeVerification,
        otherDocument: files.otherDocument ? `http://localhost:5000/${files?.otherDocument?.[0]?.path}` : existingDocs?.otherDocument,
        driverId,
      };

      if (existingDocs) {
        await existingDocs.update(documentsData);
      } else {
        await driverDocuments.create(documentsData);
      }
    }

    // -------------------------------------------------------------------
    // 7. UPDATE PAYMENT
    // -------------------------------------------------------------------
    const existingPayment = await driverPayment.findOne({ where: { driverId } });

    if (bankName || accountNumber || ifscCode) {
      const paymentData = {
        bankName,
        bankBranch,
        accountHolderName,
        accountNumber,
        upiNumber,
        ifscCode,
        accountType,
        bankPassbook: files.bankPassbook ? `http://localhost:5000/${files?.bankPassbook?.[0]?.path}` : existingPayment?.bankPassbook,
        QRImage: files.QRImage ? `http://localhost:5000/${files?.QRImage?.[0]?.path}` : existingPayment?.QRImage,
        driverId,
      };

      if (existingPayment) {
        await existingPayment.update(paymentData);
      } else {
        await driverPayment.create(paymentData);
      }
    }

    // -------------------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------------------
    res.status(200).json({
      message: "Driver updated successfully with all modules",
      driverId,
      filesUpdated: Object.keys(files)
    });

  } catch (error) {
    console.error("Final Error updating driver:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    await relocateDriver.destroy({
      where: { driverId: driverId }
    });
    await driver.destroy({ where: { id: driverId } });
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listAllDrivers = async (req, res) => {
  try {
    const {
      name,
      phone1,
      email,
      sourceTypeId,
      driverTypeId,
      startDate,
      endDate,
      categoryStatus,

      // Address Filters
      pincode,
    } = req.query;


    console.log(req.query, "req.query..............");

    const filters = {};

    // ⭐ Name Filter (Full name search)
    if (name) {
      filters[Op.and] = [
        Sequelize.where(
          Sequelize.fn(
            "LOWER",
            Sequelize.fn(
              "CONCAT",
              Sequelize.col("firstName"),
              " ",
              Sequelize.col("middleName"),
              " ",
              Sequelize.col("lastName")
            )
          ),
          {
            [Op.like]: `%${name.toLowerCase()}%`,
          }
        ),
      ];
    }

    // ⭐ Direct Driver Table Filters
    if (phone1) filters.phone1 = phone1;
    if (email) filters.email = email;
    if (sourceTypeId) filters.sourceTypeId = sourceTypeId;
    if (driverTypeId) filters.driverTypeId = driverTypeId;
    if (categoryStatus) filters.categoryStatus = categoryStatus;

    // ⭐ Address Filters (like search)
    if (pincode) filters.pincode = pincode;

    // ⭐ Date Filters
    if (startDate && endDate) {
      filters.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      filters.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      filters.createdAt = { [Op.lte]: new Date(endDate) };
    }

    // ============================================================
    // ⭐ MAIN QUERY
    // ============================================================
    const drivers = await driver.findAll({
      where: filters,

      include: [
        { model: driverEducation, as: "driverEducation", required: false },
        { model: driverHealth, as: "driverHealth", required: false },
        { model: familyRelationsModel, as: "familyRelations", required: false },
        {
          model: driverExperienceModel,
          as: "driverExperience",
          required: false,
          include: [
            { model: JobType, as: "jobtype", required: false },
            { model: VehicleType, as: "vehicletype", required: false }
          ]
        },
        { model: driverFamily, as: "driverFamily", required: false },
        { model: driverDocuments, as: "driverDocuments", required: false },
        { model: driverPayment, as: "driverPayment", required: false },

        // ⭐ Country filter by name
        {
          model: Country,
          as: "country",
          required: false
        },

        // ⭐ State filter by name
        {
          model: State,
          as: "state",
          required: false
        },

        // ⭐ Permanent address filters
        {
          model: Country,
          as: "permanentcountry",
          required: false,
          // where: {
          //   ...(countryName && {
          //     name: { [Op.like]: `%${countryName}%` },
          //   }),
          // },
        },
        {
          model: State,
          as: "permanentstate",
          required: false,
          // where: {
          //   ...(stateName && {
          //     name: { [Op.like]: `%${stateName}%` },
          //   }),
          // },
        },

        // ⭐ All other master tables
        { model: DriverType, as: "drivertype", required: false, where: { status: "active" } },
        { model: SourceType, as: "sourcetype", required: false, where: { status: "active" } },
        { model: ExpectedSalary, as: "expectedsalary", required: false, where: { status: "active" } },
        { model: LicenseType, as: "licensetype", required: false, where: { status: "active" } },
      ],
    });

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listAllActiveDrivers = async (req, res) => {
  try {
    console.log("active list entry................");
    
    const drivers = await driver.findAll({
      where: { status: "active" },
      // include: [
      //   { model: driverEducation, as: "driverEducation", required: false },
      //   { model: driverHealth, as: "driverHealth", required: false },
      //   { model: familyRelationsModel, as: "familyRelations", required: false },
      //   {
      //     model: driverExperienceModel,
      //     as: "driverExperience",
      //     required: false,
      //     include: [
      //       { model: JobType, as: "jobtype", required: false },
      //       { model: VehicleType, as: "vehicletype", required: false }
      //     ]
      //   },
      //   { model: driverFamily, as: "driverFamily", required: false },
      //   { model: driverDocuments, as: "driverDocuments", required: false },
      //   { model: driverPayment, as: "driverPayment", required: false },

      //   // ⭐ Country filter by name
      //   {
      //     model: Country,
      //     as: "country",
      //     required: false
      //   },

      //   // ⭐ State filter by name
      //   {
      //     model: State,
      //     as: "state",
      //     required: false
      //   },

      //   // ⭐ Permanent address filters
      //   {
      //     model: Country,
      //     as: "permanentcountry",
      //     required: false,
      //     // where: {
      //     //   ...(countryName && {
      //     //     name: { [Op.like]: `%${countryName}%` },
      //     //   }),
      //     // },
      //   },
      //   {
      //     model: State,
      //     as: "permanentstate",
      //     required: false,
      //     // where: {
      //     //   ...(stateName && {
      //     //     name: { [Op.like]: `%${stateName}%` },
      //     //   }),
      //     // },
      //   },

      //   // ⭐ All other master tables
      //   { model: DriverType, as: "drivertype", required: false, where: { status: "active" } },
      //   { model: SourceType, as: "sourcetype", required: false, where: { status: "active" } },
      //   { model: ExpectedSalary, as: "expectedsalary", required: false, where: { status: "active" } },
      //   { model: LicenseType, as: "licensetype", required: false, where: { status: "active" } },
      // ],
    });
console.log(drivers,"drivers.............");

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchDrivers = async (req, res) => {
  try {
    const { query } = req.query;
    const drivers = await driver.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { phone1: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const filterDriversByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const drivers = await driver.findAll({ where: { status } });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkUpload = async (req, res) => {
  try {
    const drivers = req.body.drivers;

    // Validate input
    if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
      return res.status(400).json({ error: "drivers array is required" });
    }

    let success = [];
    let failed = [];

    for (let i = 0; i < drivers.length; i++) {
      const row = drivers[i];
      const rowNumber = i + 1;

      // Convert phone to string
      const phone1 = row.phone1 ? row.phone1.toString().trim() : "";
      const email = row.email ? row.email.toString().trim() : "";

      // ---------------------------
      // 1️⃣ PHONE REQUIRED CHECK
      // ---------------------------
      if (!phone1 || phone1 === "" || phone1 === "null" || phone1 === "undefined") {
        failed.push({
          row: rowNumber,
          reason: "Phone Number is required.",
          data: row,
        });
        continue;
      }

      // ---------------------------
      // 2️⃣ UNIQUE PHONE CHECK
      // ---------------------------
      const exists = await driver.findOne({ where: { phone1 } });

      if (exists) {
        failed.push({
          row: rowNumber,
          reason: `Phone number already exists: ${phone1}`,
          data: row,
        });
        continue;
      }

      // ---------------------------
      // 1️⃣ EMAIL REQUIRED CHECK
      // ---------------------------
      if (!email || email === "" || email === "null" || email === "undefined") {
        failed.push({
          row: rowNumber,
          reason: "Email is required.",
          data: row,
        });
        continue;
      }

      // ---------------------------
      // 2️⃣ UNIQUE Email CHECK
      // ---------------------------
      const existsEmail = await driver.findOne({ where: { email } });

      if (existsEmail) {
        failed.push({
          row: rowNumber,
          reason: `Email already exists: ${email}`,
          data: row,
        });
        continue;
      }

      // ---------------------------
      // 3️⃣ PREPARE DATA
      // ---------------------------
      const driverData = {
        sourceTypeId: row.sourceTypeId || null,
        driverTypeId: row.driverTypeId || null,
        firstName: row.firstName || "",
        middleName: row.middleName || "",
        lastName: row.lastName || "",
        email: row.email || null,
        phone1: phone1,
        phone2: row.phone2 || null,
        dob: row.dob || null,
        age: row.age || null,
        gender: row.gender || null,
        licenseTypeId: row.licenseTypeId || null,
        smoking: row.smoking || null,
        color: row.color || null,
        maritalStatus: row.maritalStatus || null,
        bodyType: row.bodyType || null,
        totalExperience: row.totalExperience || null,
        nationality: row.nationality || null,
        religion: row.religion || null,
        status: "active",
        categoryStatus: "New",
        currentSalary: row.currentSalary || null,
        expectedSalaryId: row.expectedSalaryId || null,

        // Address
        house: row.house || null,
        street: row.street || null,
        landmark: row.landmark || null,
        city: row.city || null,
        stateId: row.stateId || null,
        pincode: row.pincode || null,
        countryId: row.countryId || null,
        permanentHouse: row.permanentHouse || null,
        permanentStreet: row.permanentStreet || null,
        permanentLandmark: row.permanentLandmark || null,
        permanentCity: row.permanentCity || null,
        permanentStateId: row.permanentStateId || null,
        permanentPincode: row.permanentPincode || null,
        permanentCountryId: row.permanentCountryId || null,
      };

      // ---------------------------
      // 4️⃣ CREATE DRIVER
      // ---------------------------
      try {
        const created = await driver.create(driverData);
        success.push({ row: rowNumber, id: created.id, phone1 });
      } catch (err) {
        failed.push({
          row: rowNumber,
          reason: err.message,
          data: row,
        });
      }
    }

    // ---------------------------
    // RETURN RESPONSE
    // ---------------------------
    return res.status(200).json({
      message: "Bulk upload completed",
      totalRows: drivers.length,
      successCount: success.length,
      failedCount: failed.length,
      success,
      failed,
    });

  } catch (error) {
    console.error("Bulk Upload Body Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const statusToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // ✅ Validate input
    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      });
    }

    // ✅ Check if record exists
    const driverdata = await driver.findByPk(id);
    console.log(driverdata, "driverdata...........");

    if (!driverdata) {
      return res.status(404).json({ message: "driver not found." });
    }
    // ✅ Update status
    await driverdata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `driverdata status updated to '${status}'.`,
      data: driverdata,
    });
  } catch (error) {
    console.error("❌ Error toggling driver status:", error);
    return res.status(500).json({
      message: "Internal server error while updating driver status.",
      error: error.message,
    });
  }
};

