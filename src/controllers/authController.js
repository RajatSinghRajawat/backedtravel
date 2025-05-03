const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Common/Emailsendr');
const TravelPlan = require('../models/TravelPlan');
const adminModels = require('../models/admin');


exports.ChekEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        console.log(user, "mmmm");
        if (user && (user.status === true || user.status === 'true')) {
            return res.status(200).json({ status: 0, passwordStaus: user.password ? true : false, message: "Email available" });
        }
        res.status(200).json({ status: 1, message: "Email Not available" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 11, message: "Error checking email", error });
    }
};

// exports.sendEmail = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const otp = Math.floor(100000 + Math.random() * 900000);

//         const subject = 'Your Solo Trip OTP Verification Code';
//         const text = `Your OTP for Solo Trip account verification is: ${otp}`;
//         const html = `
//             <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
//                 <h2 style="color: #3498db;">Welcome to Solo Trip! 🏞️</h2>
//                 <p style="font-size: 18px;">Your One-Time Password (OTP) for account verification is:</p>
//                 <h1 style="color: #e74c3c;">${otp}</h1>
//                 <p style="font-size: 16px;">Please enter this code to complete your verification. The OTP is valid for 10 minutes.</p>
//                 <hr style="margin: 20px 0;">
//                 <p style="font-size: 14px; color: #7f8c8d;">If you did not request this, please ignore this email.</p>
//                 <p style="font-size: 14px; color: #7f8c8d;">Happy Travels! 🌍<br>— The Solo Trip Team</p>
//             </div>
//         `;
//         sendEmail(
//             email,
//             subject,
//             text,
//             html
//         ).catch(console.error);

//         let hashedPassword = null;
//         if (password) {
//             hashedPassword = await bcrypt.hash(password, 10);
//         }
//         const user = await User.findOne({ email });
//         if (!user) {
//             await User.create({
//                 email,
//                 Otp: otp,
//                 password: hashedPassword
//             });
//         } else {
//             const updateData = { Otp: otp };
//             if (password) {
//                 updateData.password = hashedPassword;
//             }
//             await User.updateOne({ email }, { $set: updateData });
//         }
//         res.status(200).json({ message: "Email sent successfully" });
//     } catch (error) {
//         console.error("Error =>", error);
//         res.status(500).json({ message: "Error logging in", error: error.message });
//     }
// };

exports.sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const subject = 'Your Solo Trip OTP Verification Code';
        const text = `Your OTP for Solo Trip account verification is: ${otp}`;
        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #3498db;">Welcome to Solo Trip! 🏞️</h2>
                <p style="font-size: 18px;">Your One-Time Password (OTP) for account verification is:</p>
                <h1 style="color: #e74c3c;">${otp}</h1>
                <p style="font-size: 16px;">Please enter this code to complete your verification. The OTP is valid for 10 minutes.</p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 14px; color: #7f8c8d;">If you did not request this, please ignore this email.</p>
                <p style="font-size: 14px; color: #7f8c8d;">Happy Travels! 🌍<br>— The Solo Trip Team</p>
            </div>
        `;
        sendEmail(
            email,
            subject,
            text,
            html
        ).catch(console.error);
        const user = await User.findOne({ email });
        if (!user) {
            await User.insertOne({
                Otp: otp,
                email
            })
        } else {
            await User.updateOne({ email }, { Otp: otp });
        }
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        console.log(user, "kk");
        if (!user) return res.status(404).json({ status: 0, message: "User not found" });
        if (user.Otp != otp) return res.status(400).json({ status: 0, message: "Invalid OTP" });
        user.status = true;
        await user.save();
        res.status(200).json({ status: 1, message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ status: 11, message: "Error verifying OTP", error });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 0, message: "User not found" });
        }
        if (!user.status) {
            return res.status(400).json({ status: 0, message: "OTP not verified" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.Otp = null; // Clear OTP after successful password reset
        await user.save();
        res.status(200).json({ status: 1, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password", error);
        res.status(500).json({ status: 11, message: "Error resetting password", error });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findOne({ email });

        const token = jwt.sign({ userId: user._id }, "tew", { expiresIn: '1d' });

        user.password = hashedPassword;
        user.token = token;



        await user.save();
        res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, "dfddf");

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};


// Simple Logout - JWT
exports.logout = async (req, res) => {
    try {

        const user = await User.findOneAndUpdate(
            { token: null }
        );
        if (!user) {
            return res.status(404).json({ status: false, error: "User not found" });
        }
        res.status(200).json({ message: "Logout successful. Remove token from client side." });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        // Destructure fields from req.body
        const {
            name,
            password,
            textarea,
            committingName,
            location,
            country,
            city,
            travelStyle,
            budgetRange,
            foodPreference,
            hiking
        } = req.body;

        let updatedData = {
            name,
            textarea,
            committingName,
            location,
            country,
            city,
            travelStyle,
            budgetRange,
            foodPreference,
            hiking
        };
        // updatedData = Object.fromEntries(
        //     Object.entries(updatedData).filter(([_, value]) => value !== undefined)
        // );

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }
        if (req.file) {
            updatedData.img = req.file.filename;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User fetched successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};



exports.sendUserDetailsToEventCreator = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        // Find the event by ID
        const event = await TravelPlan.findById(eventId).populate('creator');
        if (!event) {
            return res.status(404).json({ status: 0, message: 'Event not found' });
        }

        // Find the user who clicked the button
        const user = await User.findById(userId).select('name email city country travelStyle');
        if (!user) {
            return res.status(404).json({ status: 0, message: 'User not found' });
        }

        // Get the event creator's email
        const creatorEmail = event.creator.email;

        // Prepare email content
        const subject = `New Interest in Your Event: ${event.title}`;
        const text = `A user has shown interest in your event "${event.title}".\n\nUser Details:\nName: ${user.name}\nEmail: ${user.email}\nCity: ${user.city || 'N/A'}\nCountry: ${user.country || 'N/A'}\nTravel Style: ${user.travelStyle || 'N/A'}`;
        const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #3498db;">New Interest in Your Event!</h2>
          <p>A user has shown interest in your event: <strong>${event.title}</strong></p>
          <h3>User Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>City:</strong> ${user.city || 'N/A'}</li>
            <li><strong>Country:</strong> ${user.country || 'N/A'}</li>
            <li><strong>Travel Style:</strong> ${user.travelStyle || 'N/A'}</li>
          </ul>
          <p style="color: #7f8c8d;">You can contact the user for further details.</p>
          <p style="color: #7f8c8d;">— The Solo Trip Team</p>
        </div>
      `;

        // Send email to the event creator
        await sendEmail(creatorEmail, subject, text, html);

        res.status(200).json({ status: 1, message: 'User details sent to event creator successfully' });
    } catch (error) {
        console.error('Error sending user details:', error);
        res.status(500).json({ status: 0, message: 'Error sending user details', error });
    }
};




exports.adminregister = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Optional: Check if user already exists
        const existingUser = await adminModels.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        // Create and save user
        const user = await adminModels.create({ email, password });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};





exports.getAdmin = async (req, res) => {
    try {
        const admin = await adminModels.find();
        if (!admin) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User fetched successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};
