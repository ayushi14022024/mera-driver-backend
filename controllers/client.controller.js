
import client from '../models/client.model.js';
import Country from '../models/country.model.js';
import State from '../models/state.model.js';
import DriverType from '../models/drivertype.model.js';
import SourceType from '../models/source.model.js';
import JobType from '../models/jobtype.model.js';
import VehicleType from '../models/vehicletype.model.js';
import { Op, Sequelize } from "sequelize";
import XLSX from "xlsx";

export const createclients = async (req, res) => {
    try {

        const {   sourceTypeId, driverTypeId, firstName, middleName, lastName, email,
            phone, dob, age, gender, maritalStatus, jobTypeId, vehicleTypeId, nationality,
            religion, status, house, street, landmark, city, stateId, pincode, countryId
        } = req.body;
       const files = req.files || {};
        const existsPhone = await client.findOne({ where: { phone } });
        if (existsPhone) {
            return res.status(400).json({ message: `Phone: ${phone} already exist.` });
        }

        const existsEmail = await client.findOne({ where: { email } });
        if (existsEmail) {
            return res.status(400).json({ message: `Email: ${email} already exist.` });
        }

        // Step 1: Create client
        const clientData = {
            sourceTypeId,
            driverTypeId,
            firstName,
            middleName,
            lastName,
            email,
            phone,
            dob,
            age,
            gender,
            maritalStatus,
            jobTypeId,
            vehicleTypeId,
            nationality,
            religion,
            status: "active",
            house,
            street,
            landmark,
            city,
            stateId,
            pincode,
            countryId,
            profilePhoto: files.profilePhoto ? `http://localhost:5000/${files?.profilePhoto?.[0]?.path}` : null,
        };

        // Create client
        const clientResult = await client.create(clientData);
        res.status(200).json({
            message: "client create successfully",
            data: clientResult,
        });

    } catch (error) {
        console.error("Error saving complete client data:", error);
        res.status(500).json({ error: error.message });
    }
};

export const updateclients = async (req, res) => {
    try {
        const clientId = req.params.id;

        if (!clientId) {
            return res.status(400).json({ error: "Client ID is required" });
        }

        const existingclient = await client.findByPk(clientId);
        if (!existingclient) {
            return res.status(404).json({ error: "client not found" });
        }

        // Extract body data
        const {
            sourceTypeId, driverTypeId, firstName, middleName, lastName, email,
            phone, dob, age, gender, maritalStatus, jobTypeId, vehicleTypeId,
            nationality, religion, status, house, street, landmark, city,
            stateId, pincode, countryId } = req.body;


        if (phone) {
            const existsPhone = await client.findOne({
                where: { phone, id: { [Op.ne]: clientId } }
            });

            if (existsPhone) {
                return res
                    .status(400)
                    .json({ message: `Phone ${phone} already exists.` });
            }
        }

        if (email) {
            const existsEmail = await client.findOne({
                where: { email, id: { [Op.ne]: clientId } }
            });

            if (existsEmail) {
                return res
                    .status(400)
                    .json({ message: `Email ${email} already exists.` });
            }
        }

        const files = req.files || {};
  const clientUpdateData = {
            sourceTypeId,
            driverTypeId,
            firstName,
            middleName,
            lastName,
            email,
            phone,
            dob,
            age,
            gender,
            maritalStatus,
            jobTypeId,
            vehicleTypeId,
            nationality,
            religion,
            status,
            house,
            street,
            landmark,
            city,
            stateId,
            pincode,
            countryId,
            profilePhoto: files.profilePhoto ? `http://localhost:5000/${files?.profilePhoto?.[0]?.path}` : existingclient.profilePhoto,
        };
        await existingclient.update(clientUpdateData);

        res.status(200).json({
            message: "Client updated successfully.",
            clientId,
            filesUpdated: Object.keys(files)
        });

    } catch (error) {
        console.error("Final Error updating client:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllclients = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            sourceTypeId,
            driverTypeId
        } = req.query;

        const filters = {};



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
                        [Op.like]: `%${name.toLowerCase()}%`
                    }
                )
            ];
        }

        if (phone) filters.phone = phone;
        if (email) filters.email = email;
        if (sourceTypeId) filters.sourceTypeId = sourceTypeId;
        if (driverTypeId) filters.driverTypeId = driverTypeId;


        const clients = await client.findAll({
            where: filters,
            include: [
                { model: Country, as: "country", required: false, where: { status: "active" } },
                { model: State, as: "state", required: false, where: { status: "active" } },
                { model: DriverType, as: "drivertype", required: false, where: { status: "active" } },
                { model: SourceType, as: "sourcetype", required: false, where: { status: "active" } },
                { model: JobType, as: "jobtype", required: false, where: { status: "active" } },
                { model: VehicleType, as: "vehicletype", required: false, where: { status: "active" } },
            ]
        });

        res.status(200).json(clients);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllActiveData = async (req, res) => {
    try {
        const clients = await client.findAll({
            where: { status: "active" },
            include: [
                { model: Country, as: "country", required: false, where: { status: "active" } },
                { model: State, as: "state", required: false, where: { status: "active" } },
                { model: DriverType, as: "drivertype", required: false, where: { status: "active" } },
                { model: SourceType, as: "sourcetype", required: false, where: { status: "active" } },
                { model: JobType, as: "jobtype", required: false, where: { status: "active" } },
                { model: VehicleType, as: "vehicletype", required: false, where: { status: "active" } },
            ]
        });

        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getclientById = async (req, res) => {
    try {
        const { id } = req.params;

        const clientInfo = await client.findOne({
            where: { id },
            include: [
                { model: Country, as: "country", required: false, where: { status: "active" } },
                { model: State, as: "state", required: false, where: { status: "active" } },
                { model: DriverType, as: "drivertype", required: false, where: { status: "active" } },
                { model: SourceType, as: "sourcetype", required: false, where: { status: "active" } },
                { model: JobType, as: "jobtype", required: false, where: { status: "active" } },
                { model: VehicleType, as: "vehicletype", required: false, where: { status: "active" } },
            ]
        });

        if (!clientInfo) {
            return res.status(404).json({ error: "client not found" });
        }

        res.status(200).json(clientInfo);
    } catch (error) {
        console.error("❌ Error fetching client details:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteclients = async (req, res) => {
    try {
        const { id } = req.params;

        await client.destroy({ where: { id: id } });
        res.status(200).json({ message: "client deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const clientdata = await client.findByPk(id);
        if (!clientdata) {
            return res.status(404).json({ message: "client not found." });
        }
        await clientdata.update({ status: status.toLowerCase() });

        return res.status(200).json({
            message: `clientdata status updated to '${status}'.`,
            data: clientdata,
        });
    } catch (error) {
        console.error("❌ Error toggling client status:", error);
        return res.status(500).json({
            message: "Internal server error while updating client status.",
            error: error.message,
        });
    }
};