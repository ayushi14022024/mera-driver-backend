import blogs from "../models/blogs.model.js";
import fs from "fs";
import { Op } from "sequelize";

// ➕ Create Blogs
export const createblogs = async (req, res) => {
  try {
    const { title, alt_tag, meta_tags, meta_description, details, status } = req.body;

    // ✅ Validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Check for duplicate title
    const existingBlog = await blogs.findOne({ where: { title } });
    if (existingBlog) {
      return res.status(400).json({ message: "Blog title already exists" });
    }

    const image = `http://localhost:5000/${req.file.path}`;

    const newBlog = await blogs.create({
      title,
      alt_tag,
      meta_tags,
      meta_description,
      details,
      image,
      status: status || "active",
    });

    res.status(201).json({
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Blogs
export const updateblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, alt_tag, meta_tags, meta_description, details, status } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const existingBlog = await blogs.findByPk(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ✅ Check for duplicate title (exclude current blog)
    const duplicateBlog = await blogs.findOne({
      where: {
        title,
        id: { [Op.ne]: id },
      },
    });

    if (duplicateBlog) {
      return res.status(400).json({ message: "Blog title already exists" });
    }

    // ✅ Handle new image upload
    let updatedImage = existingBlog.image;
    if (req.file) {
      if (existingBlog.image && fs.existsSync(existingBlog.image)) {
        fs.unlinkSync(existingBlog.image); // delete old image (optional)
      }
      updatedImage = `http://localhost:5000/${req.file.path}`;
    }

    await existingBlog.update({
      title,
      alt_tag,
      meta_tags,
      meta_description,
      details,
      image: updatedImage,
      status,
    });

    res.status(200).json({
      message: "Blog updated successfully",
      data: existingBlog,
    });
  } catch (error) {
    console.error("Error updating blogs:", error);
    res.status(500).json({ error: error.message });
  }
};



// 📄 Get All blogss
export const getAllblogss = async (req, res) => {
  try {
    const blogsdata = await blogs.findAll();
    res.status(200).json(blogsdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveData = async (req, res) => {
  try {
    const blogsdata = await blogs.findAll( {where: { status: "active" }});
    res.status(200).json(blogsdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔍 Get blogs by ID
export const getblogsById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogsdata = await blogs.findByPk(id);
    if (!blogsdata) return res.status(404).json({ message: "blogs not found" });
    res.status(200).json(blogsdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ❌ Delete blogs
export const deleteblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const blogsdata = await blogs.findByPk(id);

    if (!blogsdata) return res.status(404).json({ message: "blogs not found" });

    await blogsdata.destroy();
    res.status(200).json({ message: "blogs deleted successfully" });
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
    const blogsdata = await blogs.findByPk(id);
    if (!blogsdata) {
      return res.status(404).json({ message: "blogs not found." });
    }

    // ✅ Update status
    await blogsdata.update({ status: status.toLowerCase() });

    return res.status(200).json({
      message: `blogs status updated to '${status}'.`,
      data: blogsdata,
    });
  } catch (error) {
    console.error("❌ Error toggling blogs status:", error);
    return res.status(500).json({
      message: "Internal server error while updating blogs status.",
      error: error.message,
    });
  }
};