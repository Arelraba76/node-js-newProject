const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    openingHours: { type: String, required: true },
    closingHours: { type: String, required: true },
    }, {timestamps: true});

module.exports = mongoose.model('City', citySchema);
