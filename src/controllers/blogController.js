const Blog = require("../models/blogModel");

// Upload a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, shortdescription, fulldescription, facebook, threads, States, City } = req.body;
    console.log(req.body);

    const imgs = req.files ? req.files.map(file => file.filename) : [];

    console.log(imgs);

    if (!title || !shortdescription || !fulldescription || !imgs || !facebook || !threads || !States || !City) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBlog = await Blog.create({ title, shortdescription, img: imgs, fulldescription, facebook, threads, States, City });

    res.status(201).json({ message: "Blog uploaded successfully", blog: newBlog });
  } catch (error) {
    console.error(error); // Error log karna useful hota hai
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all blogs
// exports.getAllBlogs = async (req, res) => {
//   try {
//     let { page = 1, limit = 10, States, City } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     const query = {};

//     // Apply filters if state or city is provided
//     if (state) {
//       query.States = { $regex: new RegExp(state, "i") }; 
//     }
//     if (city) {
//       query.City = { $regex: new RegExp(city, "i") };
//     }

//     console.log("Query Object:", query); // Debugging

//     const blogs = await Blog.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit);
//     console.log(blogs);

//     const totalBlogs = await Blog.countDocuments(query);

//     res.status(200).json({
//       message: "Get all blogs",
//       blogs,
//       currentPage: page,
//       totalPages: Math.ceil(totalBlogs / limit),
//       totalBlogs,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


exports.getAllBlogs = async (req, res) => {
  console.log("Received Query:", req.query);

  try {
    let { page = 1, limit = 10, state, city } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
if (req.query.States) {
  query.States = { $regex: new RegExp(req.query.States, "i") };
}
if (req.query.City) {
  query.City = { $regex: new RegExp(req.query.City, "i") };
}

    console.log("Generated Query:", query); // Debugging

    const blogs = await Blog.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Fetched Blogs:", blogs); // Debugging

    const totalBlogs = await Blog.countDocuments(query);

    res.status(200).json({
      message: "Get all blogs",
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });
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
