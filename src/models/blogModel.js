const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortdescription: { type: String, required: true },
  fulldescription: { type: String, required: true },
  facebook: { type: String, required: true },
  threads: { type: String, required: true },
  img: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
