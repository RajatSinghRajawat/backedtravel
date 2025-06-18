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
        if (!user) return res.status(404).json({ status: 0, message: "User not found" });
        if (user.Otp != otp) return res.status(400).json({ status: 0, message: "Invalid OTP" });

        await User.updateOne({ email }, { status: true }); // Bina validation ke update
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
        await User.updateOne(
            { email },
            { password: hashedPassword, Otp: null }
        );

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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
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

        const event = await TravelPlan.findById(eventId).populate('creator');
        console.log(event, "event");

        if (!event) {
            return res.status(404).json({ status: 0, message: 'Event not found' });
        }

        // Find the user who expressed interest
        const user = await User.findById(userId).select('name email city country travelStyle');
        if (!user) {
            return res.status(404).json({ status: 0, message: 'User not found' });
        }

        // Email details
        const creatorEmail = event.creator.email;
        const subject = `New Interest in Your Event: ${event.interests}`;
        const text = `A user has shown interest in your event ${event.interests}.\n\nUser Details:\nName: ${user.name}\nEmail: ${user.email}\nCity: ${user.city || 'N/A'}\nCountry: ${user.country || 'N/A'}\nTravel Style: ${user.travelStyle || 'N/A'}`;

        const html = `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c3e50;">🚀 Someone is Interested in Your Travel Event!</h2>
                    <p style="color: #555;">A user has shown interest in your event: <strong>${event.interests}</strong></p>
                    
                    <h3 style="color: #3498db;">User Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Name:</td>
                            <td style="padding: 8px;">${user.name}</td>
                        </tr>
                        <tr style="background: #f2f2f2;">
                            <td style="padding: 8px; font-weight: bold;">Email:</td>
                            <td style="padding: 8px;">${user.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">City:</td>
                            <td style="padding: 8px;">${user.city || 'N/A'}</td>
                        </tr>
                        <tr style="background: #f2f2f2;">
                            <td style="padding: 8px; font-weight: bold;">Country:</td>
                            <td style="padding: 8px;">${user.country || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Travel Style:</td>
                            <td style="padding: 8px;">${user.travelStyle || 'N/A'}</td>
                        </tr>
                       
                    </table>

                    <p style="margin-top: 20px; color: #7f8c8d;">Feel free to connect with this user to plan your trip together!</p>
                    <p style="color: #95a5a6; font-size: 14px;">— The Solo Trip Team</p>
                </div>
            </div>
        `;

        // Send the email
        await sendEmail(creatorEmail, subject, text, html);

        return res.status(200).json({
            status: 1,
            message: 'User details sent to event creator successfully'
        });

    } catch (error) {
        console.error('Error sending user details:', error);
        return res.status(500).json({
            status: 0,
            message: 'Error sending user details',
            error: error.message
        });
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
