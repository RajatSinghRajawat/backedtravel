const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});


const TravelPlanSchema = new mongoose.Schema({
  destination: { type: String },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  transport: {
    type: String,
    required: true,
    enum: ["Car", "Bus", "Train", "Flight", "Bike", "Boat"]
  },
  interests: {
    type: Array,
    required: true,
    // enum: ["Mountains", "Trekking", "Beaches", "Wildlife", "City Tour", "Adventure Sports", "Cultural"]
  },
  budget: { type: Number, required: true },
  travelBuddyGender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
    trim: true,
  },
  travelBuddyAge: {
    type: String,
    required: true
  },
  travelAuthor: {
    type: String,
    required: true
  },
  travelDescription: {
    type: String,
    required: true
  },
  States: { type: String, required: true },
  City: { type: String, required: true },

  img: { type: [], required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],

});

const TravelPlan = mongoose.model("TravelPlan", TravelPlanSchema);
module.exports = TravelPlan;
