import State from "../models/state.model.js";
import Country from "../models/country.model.js"; // ⬅️ import Country model
import { Op } from "sequelize";

export const createstate = async (req, res) => {
  try {
    const { name, code, countryId, status } = req.body;

    // ✅ Basic validation
    if (!name || !countryId) {
      return res
        .status(400)
        .json({ message: "State name and country are required." });
    }

    // ✅ Check for duplicate state name under the same country
    const existingState = await State.findOne({
      where: {
        name: name.trim(),
        countryId,
      },
    });

    if (existingState) {
      return res
        .status(400)
        .json({ message: "State with the same name already exists in this country." });
    }

    // ✅ Create new state
    const newState = await State.create({
      name: name.trim(),
      code,
      countryId,
      status: status || "active",
    });

    // ✅ Fetch with country info
    const populatedState = await State.findByPk(newState.id, {
      include: {
        model: Country,
        as: "country",
        attributes: ["id", "name", "code", "status"],
      },
    });

    return res.status(201).json({
      message: "State created successfully",
      data: populatedState,
    });
  } catch (error) {
    console.error("Error creating state:", error);
    return res.status(500).json({ error: error.message });
  }
};


// 📄 Get All states (with country populated)
export const getAllstates = async (req, res) => {
  try {
    const states = await State.findAll({
      include: {
        model: Country,
        as: "country",
        where: { status: "active" }
      },
    });

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const states = await State.findAll({
      where: { status: "active" },
      include: {
        model: Country,
        as: "country",
        where: { status: "active" },
      },
    });

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveStateByCountryId = async (req, res) => {
  try {
    const { countryId } = req.query; 

    if (!countryId) {
      return res.status(400).json({ error: "countryId is required" });
    }

    const states = await State.findAll({
      where: {
        status: "active",
        countryId: countryId,
      },
      include: {
        model: Country,
        as: "country",
        where: { status: "active" },
      },
    });

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No active states found for this country" });
    }

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get state by ID (with country populated)
export const getstateById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundState = await State.findByPk(id, {
      include: {
        model: Country,
        as: "country",
        attributes: ["id", "name", "code", "status"],
      },
    });

    if (!foundState) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json(foundState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update state
export const updatestate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, countryId, status } = req.body;

    // Validate required fields
    if (!name || !countryId) {
      return res.status(400).json({ message: "Name and countryId are required" });
    }

    const foundState = await State.findByPk(id);
    if (!foundState) {
      return res.status(404).json({ message: "State not found" });
    }

    // ✅ Check for duplicate state name within the same country (excluding current record)
    const existingState = await State.findOne({
      where: {
        name,
        countryId,
        id: { [Op.ne]: id },
      },
    });

    if (existingState) {
      return res.status(400).json({
        message: "State name already exists in the same country",
      });
    }

    // Update state
    await foundState.update({ name, code, countryId, status });

    // Fetch updated state with country populated
    const updatedState = await State.findByPk(id, {
      include: {
        model: Country,
        as: "country",
        attributes: ["id", "name", "code", "status"],
      },
    });

    res.status(200).json({
      message: "State updated successfully",
      data: updatedState,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete state
export const deletestate = async (req, res) => {
  try {
    const { id } = req.params;

    const foundState = await State.findByPk(id);
    if (!foundState) {
      return res.status(404).json({ message: "State not found" });
    }

    await foundState.destroy();
    res.status(200).json({ message: "State deleted successfully" });
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
    const Statedata = await State.findByPk(id);
    if (!Statedata) {
      return res.status(404).json({ message: "State not found." });
    }

    // ✅ Update status
    await Statedata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `State status updated to '${status}'.`,
      data: Statedata,
    });
  } catch (error) {
    console.error("❌ Error toggling State status:", error);
    return res.status(500).json({
      message: "Internal server error while updating State status.",
      error: error.message,
    });
  }
};