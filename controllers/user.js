// controllers\user.js
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require("../models/user.js");
const Shoes = require("../models/shoes.js");

// Render login page
async function getLogin(req, res) {
    res.render("../views/login", { layout: false });
}

// Render register page
async function getRegister(req, res) {
    res.render("../views/register", { layout: false });
}

// Get all users from the database
async function getAllUsers(req, res) {
    console.log('getAllUsers called');
    console.log('User from token:', req.user);
    try {

        const users = await User.find({}, '-password');
        console.log('Users fetched:', users);
        res.status(200).json({message: "Users fetched successfully", users});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({message: "Failed to fetch users", error: error.message});

    }
}

// Create a new user
async function createNewUser(req, res) {
    const { firstName, lastName, email, password, isAdmin } = req.body;

    if (!firstName || !lastName || !email || !password) return res.status(400).json({message: "Please provide all fields"});
    if (!validator.isEmail(email)) return res.status(400).json({message: "Invalid email"});
    if (!validator.isStrongPassword(password)) return res.status(400).json({message: "Password not strong enough"});

    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) return res.status(400).json({message: "Email already exists"});


    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({ firstName, lastName, email, password: hashedPassword, isAdmin: isAdmin || false , shoesPurchases: [] });
        await newUser.save();


        res.status(201).json({message: "New user created successfully", newUser: {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        }});
    } catch (error) {
        console.error('Error creating new user:', error);  // הוסף לוג זה
        res.status(400).json({message: error.message});

    }
}

// Render admin dashboard if user is admin
async function getDashboard(req, res) {
    if (req.user && req.user.isAdmin) {
      const users = await User.find({}, '-password');
      res.render("dashboard", { layout: false, users: users });
    } else {
      res.status(403).json({ message: "Access denied. Admin only." });
    }
  }

// Logout the user by clearing the cookie
async function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "User logged out successfully" });
}

// Login user and generate a JWT token
async function loginUser(req, res) {
    console.log("Login attempt received with data:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({ success: true, message: "User logged in successfully", token, isAdmin: user.isAdmin });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// Delete a user by ID
async function deleteUserById(req, res) {
    const { id } = req.params;
    try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "user not found" });
        res.status(200).json({ message: `user with id ${id} has been deleted`, deletedUser: deleted });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get a user by ID
async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json({ message: "user fetched successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Update a user by ID
async function updateUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json({ message: "user updated successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// controllers/user.js
async function purchaseShoe(req, res) {
    console.log('Purchase attempt:', req.body);
    const { shoeId, title, price, description, size, quantity = 1 } = req.body;

    // בדיקה אם יש משתמש מחובר
    if (!req.user) {
        // אם אין משתמש מחובר, פשוט מחזירים הודעת הצלחה מדומה
        console.log('Simulated purchase for non-logged in user');
        return res.status(200).json({ message: "Purchase simulation successful" });
    }

    const userId = req.user._id;

    if (!shoeId || !title || !price || !description || !size) {
        return res.status(400).json({message: "Please provide all shoe details and size"});
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const shoe = await Shoes.findById(shoeId);
        if (!shoe) {
            return res.status(404).json({message: "Shoe not found"});
        }

        if (shoe.stock < quantity) {
            return res.status(400).json({message: "Not enough stock available"});
        }

        // עדכון המלאי
        shoe.stock -= quantity;
        await shoe.save();

        // הוספת הרכישה למשתמש
        user.shoesPurchases.push({
            shoeId: shoeId,
            title: title,
            price: parseFloat(price),
            description: description,
            size: parseInt(size),
            quantity: quantity
        });

        await user.save();

        console.log('Purchase successful:', { userId, shoeId, newStock: shoe.stock });
        res.status(200).json({message: "Purchase successful", newStock: shoe.stock});
    } catch (error) {
        console.error('Error making purchase:', error);
        res.status(500).json({message: "Failed to make purchase", error: error.message});
    }
}
  async function getUserPurchases(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: "User not found"});
        
        // מחזיר את כל המידע הרלוונטי של הרכישות
        const purchases = user.shoesPurchases.map(purchase => ({
            shoeId: purchase.shoeId,
            title: purchase.title,
            price: purchase.price,
            size: purchase.size,
            purchaseDate: purchase.purchaseDate
        }));
        
        res.status(200).json({message: "Purchases fetched successfully", purchases});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Add item to cart
async function addToCart(req, res) {
    const { shoeId, title, price, description, size, quantity } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const existingItemIndex = user.cart.findIndex(item => 
            item.shoeId.toString() === shoeId && item.size === parseInt(size)
        );

        if (existingItemIndex > -1) {
            // If item already exists in cart, update quantity
            user.cart[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // If item doesn't exist, add new item to cart
            user.cart.push({
                shoeId,
                title,
                price: parseFloat(price),
                description,
                size: parseInt(size),
                quantity: parseInt(quantity)
            });
        }

        await user.save();
        res.status(200).json({message: "Item added to cart", cart: user.cart});
    } catch (error) {
        res.status(500).json({message: "Failed to add item to cart", error: error.message});
    }
}


async function getCart(req, res) {
    try {
        const userId = req.user._id; // Get the user ID from the authenticated user object
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ cart: user.cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: "Failed to get cart items", error: error.message });
    }
}
// Checkout
async function checkout(req, res) {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Move items from cart to purchases
        user.shoesPurchases.push(...user.cart);

        // Clear the cart
        user.cart = [];

        await user.save();

        res.status(200).json({message: "Checkout successful", purchases: user.shoesPurchases});
    } catch (error) {
        res.status(500).json({message: "Checkout failed", error: error.message});
    }
}
module.exports = {
    getAllUsers,
    createNewUser,
    loginUser,
    deleteUserById,
    getUserById,
    updateUserById,
    getRegister,
    getLogin,
    logoutUser,
    getDashboard,
    purchaseShoe,
    getUserPurchases,
    addToCart,
    getCart,
    checkout
}