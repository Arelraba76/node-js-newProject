//models\shoes.js
const mongoose = require('mongoose');

const shoesSchema = new mongoose.Schema({
    title:{type: String, required:true},
    price:{type: Number, required:true},
    image:{type: String, required:true},
    category:{type: String, required:true},
    description:{type: String, required:true},
    stock:{type: Number, required:true},
}, {timestamps: true});

const Shoes = mongoose.model("Shoes", shoesSchema);

module.exports = Shoes;

