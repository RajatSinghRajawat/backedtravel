const mongoose = require('mongoose');

const admin = new mongoose.Schema({

    email: { type: String, unique: true, required: true },
    password: {
        type: String
        , required: true
    }

}, { timestamps: true });

const adminModels = mongoose.model('admin', admin);
module.exports = adminModels