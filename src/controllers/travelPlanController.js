const TravelPlan = require("../models/TravelPlan");

// Create a new travel plan
exports.createTravelPlan = async (req, res) => {
  try {
    const { destination, travelBuddyGender, startDate, endDate, transport, budget, travelBuddyAge, travelAuthor, travelDescription, States, City, creator } = req.body;
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
      travelDescription,
      travelAuthor,
      States,
      City,
      creator,
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
    let { page, limit, States, City, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Create filter object with regex for partial match
    let filter = {};

    if (States) {
      filter.States = { $regex: States, $options: "i" }; // Case-insensitive
    }

    if (City) {
      filter.City = { $regex: City, $options: "i" };
    }

    if (search) {
      filter.title = { $regex: new RegExp(search, "i") }; // Fix: use filter, not query
    }

    // Count total matching documents
    const total = await TravelPlan.countDocuments(filter);

    // Fetch filtered travel plans with pagination and sort by latest
    const travel = await TravelPlan.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      message: "Get all Events",
      travel,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching travel plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getTravelPlanById = async (req, res) => {
  try {
    const travel = await TravelPlan.findById(req.params.id);
    if (!travel) {
      return res.status(404).json({ message: "Travel plan not found" });
    }
    res.status(200).json({ success: true, data: travel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update travel plan
exports.updateTravelPlan = async (req, res) => {
  try {
    const updatedPlan = await TravelPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: "Travel plan not found" });
    }
    res.status(200).json({ success: true, message: "Updated successfully", data: updatedPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete travel plan
exports.deleteTravelPlan = async (req, res) => {
  try {
    const deletedPlan = await TravelPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Travel plan not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a travel plan
exports.likeTravelPlan = async (req, res) => {
  try {
    const { userId } = req.body;
    const travel = await TravelPlan.findById(req.params.id);
    if (!travel) return res.status(404).json({ message: "Travel plan not found" });

  if (travel.likes.includes(userId)) {
      travel.likes.pull(userId);
      await travel.save();
      return res.json({ message: "Unliked", likes: travel.likes.length });
    } else {
      travel.likes.push(userId);
      await travel.save();
      return res.json({ message: "Liked", likes: travel.likes.length });
    }

    await travel.save();
    res.status(200).json({ success: true, likes: travel.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a comment
exports.commentOnTravelPlan = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const travel = await TravelPlan.findById(req.params.id);
    if (!travel) return res.status(404).json({ message: "evnts not found" });

    const comment = {
      userId,
      text,
      date: new Date()
    };

    travel.comments.push({ user: userId, text });
    await travel.save();

    res.status(200).json({ success: true, comments: travel.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.geteventsComments = async (req, res) => {
  try {
    const events = await TravelPlan.findById(req.params.id).populate("comments.user", "name");
    if (!events) return res.status(404).json({ message: "Events comments not found" });

    res.json({ comments: events.comments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};


