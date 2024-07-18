const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require("../models/user.js");

async function getLogin(req, res) {
    res.render("../views/login", { layout: false });
}

async function getRegister(req, res) {
    res.render("../views/register", { layout: false });
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({message:"users fetched successfully", users});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

async function createNewUser( req,res) {
    const {firstName,lastName,email,password, isAdmin} = req.body;
    if(!firstName || !lastName || !email || !password) return res.status(400).json({message: "please provide all fields"});
    if(!validator.isEmail(email)) return res.status(400).json({message: "invalid email"});
    if(!validator.isStrongPassword(password)) return res.status(400).json({message: "password not strong enough"});

    const duplicateEmail = await User.findOne({email});
    if(duplicateEmail) return res.status(400).json({message: "email already exists"});

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await  new User({firstName,lastName,email,password:hashedPassword, isAdmin});
        await newUser.save();

        res.status(201).json({message:"new user created successfully", newUser});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

async function loginUser(req, res) {
    console.log("Received request body:", req.body);
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email);

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Invalid password for:", email);
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });

        console.log("Login successful for:", email);
        res.status(200).json({ success: true, message: "User logged in successfully", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteUserById(req, res) {
    const {id} = req.params;
    try {
        const deleted = await User.findByIdAndDelete(id);
        if(!deleted) return res.status(404).json({message:"user not found"});
        res.status(200).json({message:`user with id ${id} has been deleted`, deletedUser:deleted});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}
async function getUserById(req, res) {
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        if(!user) return res.status(404).json({message:"user not found"});
        res.status(200).json({message:"user fetched successfully", user});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

async function updateUserById(req, res) {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, {new:true});
        if(!user) return res.status(404).json({message:"user not found"});
        res.status(200).json({message:"user updated successfully", user});
    } catch (error) {
        res.status(400).json({message: error.message});
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
    getLogin
}