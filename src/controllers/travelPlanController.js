const TravelPlan = require("../models/TravelPlan");

// Create a new travel plan
exports.createTravelPlan = async (req, res) => {
  try {
    const { destination, travelBuddyGender, startDate, endDate, transport, budget, travelBuddyAge } = req.body;
    console.log(req.body);

    // If multiple images are uploaded, store their filenames in an array
    const imgs = req.files ? req.files.map(file => file.filename) : [];

    console.log(imgs);

    const newTravelPlan = new TravelPlan({
      destination,
      startDate,
      endDate,
      transport,
      budget,
      travelBuddyGender,
      travelBuddyAge,
      img: imgs // Store array of images
    });

    // Save to database
    await newTravelPlan.save();

    res.status(201).json({ success: true, message: "Travel plan created successfully", data: newTravelPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating travel plan", error: error.message });
  }
};

exports.getAllTravelPlans = async (req, res) => {
  try {
    let { page, limit } = req.query;

    // Convert query parameters to numbers and set defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await TravelPlan.countDocuments();

    const travel = await TravelPlan.find().skip(skip).limit(limit);

    res.status(200).json({
      message: "Get all Events",
      travel: travel,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
