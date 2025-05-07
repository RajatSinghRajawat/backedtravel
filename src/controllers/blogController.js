const Blog = require("../models/blogModel");

// Upload a new blog
exports.createBlog = async (req, res) => {
  try {

  const { title, shortdescription, fulldescription, facebook, States, City ,author} = req.body;
    console.log(req.body);

    const imgs = req.files ? req.files.map(file => file.filename) : [];

    console.log(imgs);

    if (!title || !shortdescription || !fulldescription || !imgs || !facebook || !States || !City || !author) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBlog = await Blog.create({ title, shortdescription, img: imgs, fulldescription, facebook, States, City , author });

    res.status(201).json({ message: "Blog uploaded successfully", blog: newBlog });
  } catch (error) {
    console.error(error); // Error log karna useful hota hai
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.likeBlog = async (req, res) => {
  const { userId } = req.body; // or from token
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.likes.includes(userId)) {
      blog.likes.pull(userId);
      await blog.save();
      return res.json({ message: "Unliked", likes: blog.likes.length });
    } else {
      blog.likes.push(userId);
      await blog.save();
      return res.json({ message: "Liked", likes: blog.likes.length });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating like", error: err.message });
  }
};


exports.addComment = async (req, res) => {
  const blogId = req.params.id;
  const { userId, text } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ user: userId, text });
    await blog.save();
    res.json({ message: "Comment added", comments: blog.comments });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("comments.user", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({ comments: blog.comments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
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
    let { page = 1, limit = 10, States, City, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (States) {
      query.States = { $regex: new RegExp(States, "i") };
    }

    if (City) {
      query.City = { $regex: new RegExp(City, "i") };
    }

    if (search) {
      query.title = { $regex: new RegExp(search, "i") }; // Search by title
    }

    console.log("Generated Query:", query); // Debugging

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(query);

    res.status(200).json({
      message: "Get all blogs",
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });
  } catch (error) {
    console.error("Error in getAllBlogs:", error);
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
