const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    textarea: { type: String },
    Otp: { type: Number },
    status: { type: Boolean, default: false },
    committingName: { type: String },
    location: { type: String },
    country: { type: String },
    city: { type: String },
    travelStyle: { type: String, enum: ['Solo', 'Group', 'Family', 'Couple'] },
    budgetRange: { type: String, enum: ['Low', 'Medium', 'High'] },
    foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'] },
    hiking: { type: String, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
