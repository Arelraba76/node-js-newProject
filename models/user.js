//models\user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    shoesPurchases: [{
        shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoes', required: false },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        purchaseDate: { type: Date, default: Date.now },
        quantity: { type: Number, default: 1 },
        size: { type: Number, required: true }
    }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;