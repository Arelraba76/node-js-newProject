// models/cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoes', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        size: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;