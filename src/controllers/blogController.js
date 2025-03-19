const Blog = require("../models/blogModel");

// Upload a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, shortdescription, fulldescription, facebook,threads } = req.body;
    console.log(req.body);

    const img = req.file ? req.file.filename : null;
    console.log(img);

    if (!title || !shortdescription || !fulldescription || !img || !facebook || !threads) {
      return res.status(400).json({ error: "All fields are required", title, shortdescription, img, fulldescription, facebook,threads });
    }

    const newBlog = await Blog.create({ title, shortdescription, img, fulldescription, facebook,threads });

    res.status(201).json({ message: "Blog uploaded successfully", blog: newBlog });
  } catch (error) {
    console.error(error); // Error log karna useful hota hai
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({message:"get all blogs" , blogs: blogs});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog found successfully", blog: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Delete blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update blog by ID 
exports.updateBlog = async (req, res) => {
  try {
    const { title, shortdescription, fulldescription } = req.body;
    const img = req.file ? req.file.filename : null;

    // Find blog and update
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortdescription,
        fulldescription,
        ...(img && { img }) // Only update image if new one provided
      },
      { new: true } // Return updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ 
      message: "Blog updated successfully",
      blog: updatedBlog 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
