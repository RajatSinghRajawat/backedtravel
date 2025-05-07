const mongoose = require("mongoose");



const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  shortdescription: { type: String, required: true },
  fulldescription: { type: String, },
  facebook: { type: String, required: true },
  States: { type: String, required: true },
  City: { type: String, required: true },
  img: { type: [], required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],

}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
 module.exports = Blog