const Blog = require("../models/blogModel");

// Upload a new blog
exports.createBlog = async (req, res) => {
  try {

    const { title, shortdescription, fulldescription, facebook, States, City, author, } = req.body;


    const imgs = req.files ? req.files.map(file => file.filename) : [];
    const userid = req.user._id;


    if (!title || !shortdescription || !fulldescription || !imgs || !facebook || !States || !City || !author) {
      return res.status(400).json({ error: "All fields are required" });
    }
    console.log(userid, "userid");

    const newBlog = await Blog.create({ title, shortdescription, img: imgs, fulldescription, facebook, States, City, author, userid });
    res.status(201).json({ message: "Blog uploaded successfully", blog: newBlog });
  } catch (error) {
    console.error(error); // Error log karna useful hota hai
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.likeBlog = async (req, res) => {
  const { userId } = req.body;
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
exports.editComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const { userId, text } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    comment.text = text;
    await blog.save();

    res.json({ message: "Comment updated", comments: blog.comments });
  } catch (err) {
    res.status(500).json({ message: "Error editing comment", error: err.message });
  }
};
exports.deleteComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const { userId } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // Remove the comment from the comments array
    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);
    // OR you can use: blog.comments.id(commentId).remove();

    await blog.save();

    res.json({ message: "Comment deleted", comments: blog.comments });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
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
}

exports.getAllBlogs = async (req, res) => {
  console.log("Received Query:", req.query);

  try {
    let { page = 1, limit = 10, States, City, search, userid } = req.query;
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

    if (userid) {
      query.userid = userid; // Filter by userid
    }


    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(query);
    console.log(totalBlogs);

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

// Create a blog in the Wonderlust section (admin/superadmin only)
exports.createWonderlustBlog = async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Only admin or superadmin can create Wonderlust blogs' });
    }
    const { title, content, section } = req.body;
    if (section !== 'Wonderlust') {
      return res.status(400).json({ message: 'Section must be Wonderlust' });
    }
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const blog = await Blog.create({ title, content, section, author: req.user._id });
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Wonderlust blog', error });
  }
};
