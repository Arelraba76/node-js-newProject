// routes/purchase.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Shoes = require('../models/shoes'); // Make sure to import the Shoes model
const requireAuth = require('../middlewares/requireAuth');
const { purchaseShoe } = require('../controllers/user');

router.post('/', requireAuth, purchaseShoe);
module.exports = router;