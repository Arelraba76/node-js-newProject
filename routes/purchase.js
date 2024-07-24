// routes/purchase.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Shoes = require('../models/shoes'); // Make sure to import the Shoes model
const requireAuth = require('../middlewares/requireAuth');
const { purchaseShoe } = require('../controllers/user');

router.post('/', requireAuth, async (req, res) => {
  console.log('Request body in purchase route:', req.body);
  const { shoeId, title, price, description, size } = req.body;
  const userId = req.user._id;

  console.log('User ID:', userId);
  console.log('Shoe details:', { shoeId, title, price, description, size });

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify that the shoe exists
    const shoe = await Shoes.findById(shoeId);
    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    user.shoesPurchases.push({
      shoeId: shoeId,
      title: title,
      price: parseFloat(price),
      description: description,
      size: parseInt(size),
      purchaseDate: new Date(),
      quantity: 1
    });

    await user.save();
    res.status(200).json({ message: "Purchase successful" });
  } catch (error) {
    console.error('Error making purchase:', error);
    res.status(500).json({ message: "Failed to make purchase", error: error.message });
  }
});
router.post('/', requireAuth, purchaseShoe);
module.exports = router;