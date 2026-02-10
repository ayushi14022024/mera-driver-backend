import testimonial from "../models/testimonial.model.js";
import fs from "fs";

// ➕ Create testimonial
export const createtestimonial = async (req, res) => {
  try {
    const {
      name,
      location,
      designation,
      review_link,
      meta_tags,
      meta_description,
      details,
      status,
    } = req.body;


    // File is available at req.file
    if (!req.file) {
      return res.status(400).json({ error: "Profile picture is required." });
    }

    const profile_pic = `http://localhost:5000/${req.file.path}`; // or save as URL if serving static files

    const newtestimonial = await testimonial.create({
      name,
      location,
      designation,
      review_link,
      meta_tags,
      meta_description,
      details,
      profile_pic,
      status: status || "active",
    });

    res
      .status(201)
      .json({ message: "Testimonial created successfully", data: newtestimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All testimonials
export const getAlltestimonials = async (req, res) => {
  try {
    const testimonials = await testimonial.findAll();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const testimonials = await testimonial.findAll({where: { status: "active" }});
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get testimonial by ID
export const gettestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialdata = await testimonial.findByPk(id);
    if (!testimonialdata) return res.status(404).json({ message: "testimonial not found" });
    res.status(200).json(testimonialdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update testimonial
export const updatetestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      designation,
      review_link,
      meta_tags,
      meta_description,
      details,
      status,
    } = req.body || {};

    // Check required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingTestimonial = await testimonial.findByPk(id);
    if (!existingTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // If a new profile_pic is uploaded, update it
    let updatedProfilePic = existingTestimonial.profile_pic;
    if (req.file) {
      // Delete the old file from disk (optional, only if stored locally)
      if (existingTestimonial.profile_pic && fs.existsSync(existingTestimonial.profile_pic)) {
        fs.unlinkSync(existingTestimonial.profile_pic);
      }

      updatedProfilePic =  `http://localhost:5000/${req.file.path}`;

      // If you serve static files (like `/uploads/...`), use this instead:
      // updatedProfilePic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await existingTestimonial.update({
      name,
      location,
      designation,
      review_link,
      meta_tags,
      meta_description,
      details,
      profile_pic: updatedProfilePic,
      status,
    });

    res.status(200).json({
      message: "Testimonial updated successfully",
      data: existingTestimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete testimonial
export const deletetestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialdata = await testimonial.findByPk(id);

    if (!testimonialdata) return res.status(404).json({ message: "testimonial not found" });

    await testimonialdata.destroy();
    res.status(200).json({ message: "testimonial deleted successfully" });
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
    const testimonialdata = await testimonial.findByPk(id);
    if (!testimonialdata) {
      return res.status(404).json({ message: "testimonial not found." });
    }

    // ✅ Update status
    await testimonialdata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `testimonial status updated to '${status}'.`,
      data: testimonialdata,
    });
  } catch (error) {
    console.error("❌ Error toggling testimonial status:", error);
    return res.status(500).json({
      message: "Internal server error while updating testimonial status.",
      error: error.message,
    });
  }
};