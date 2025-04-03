const mongoose = require("mongoose");

const TravelPlanSchema = new mongoose.Schema({
  destination: { type: String, required: true },
 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  transport: {
    type: String,
    required: true,
    enum: ["Car", "Bus", "Train", "Flight", "Bike", "Boat"] 
  },
  interests: { 
    type: [String], 
    required: true, 
    enum: ["Mountains", "Trekking", "Beaches", "Wildlife", "City Tour", "Adventure Sports", "Cultural"] 
  },
  budget: { type: Number, required: true },
  travelBuddyGender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"], 
    trim: true,
  },
  travelBuddyAge: {
    type: Number,
    required: true
  },

  img: { type: [], required: true }
});

const TravelPlan = mongoose.model("TravelPlan", TravelPlanSchema);
module.exports = TravelPlan;
