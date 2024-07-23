const express = require("express");
const server = express();
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const Shoe = require("./models/shoes"); // Import the Shoe model
const purchaseRoutes = require("./routes/purchase");

// Load environment variables from .env file
dotenv.config();

// Middlewares
server.use(express.json()); // Middleware to parse JSON bodies
server.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
server.use(cors()); // Enable CORS
server.use(bodyParser.json()); // Middleware to parse JSON bodies
server.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
server.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
server.use("/api/purchase", purchaseRoutes);
// אחרי זה הוסף את ה-middleware שבודק את ה-raw body

server.use(express.raw({ type: 'application/json' }));
server.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
});
// Set the view engine to EJS
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views')); // Set the views directory

// Routes
const shoesRoutes = require("./routes/shoes");
const userRoutes = require("./routes/user");
const cityRoutes = require('./routes/cities'); // Import city routes

server.use("/api/users", userRoutes); // Use user routes
server.use("/shoes", shoesRoutes); // Use shoe routes
server.use('/api/cities', cityRoutes); // Use city routes

server.get('/login/dashboard', (req, res) => {
    res.render('login/dashboard'); // Render the dashboard view
});

server.get('/', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // Fetch all shoes from the database
        res.render('home', { shoes }); // Render the home.ejs view with the shoes data
    } catch (error) {
        res.status(500).send(error.message); // Send a 500 error if something goes wrong
    }
});


server.get('/home', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // Fetch all shoes from the database
        res.render('home', { shoes }); // Render the home.ejs view with the shoes data
    } catch (error) {
        res.status(500).send(error.message); // Send a 500 error if something goes wrong
    }
});

server.get('/men', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Men' }); // Fetch men's shoes from the database
        res.render('men-shoes', { shoes }); // Render the men-shoes.ejs view with the shoes data
    } catch (error) {
        res.status(500).send(error.message); // Send a 500 error if something goes wrong
    }
});

server.get('/women', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Women' }); // Fetch women's shoes from the database
        res.render('women-shoes', { shoes }); // Render the women-shoes.ejs view with the shoes data
    } catch (error) {
        res.status(500).send(error.message); // Send a 500 error if something goes wrong
    }
});

server.get('/kids', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Kids' }); // Fetch kids' shoes from the database
        res.render('kids-shoes', { shoes }); // Render the kids-shoes.ejs view with the shoes data
    } catch (error) {
        res.status(500).send(error.message); // Send a 500 error if something goes wrong
    }
});

server.get('/sale', async (req, res) => {
    try {
        const shoes = await Shoe.find({ onSale: true }); // Fetch sale shoes from the database
        res.render('sale-shoes', { shoes }); // Render the sale-shoes.ejs view with the shoes data
    } catch (error) {
        res.status(500).send(error.message); // Send a 500 error if something goes wrong
    }
});

server.get('/login/sign-in-form', (req, res) => {
    res.render('login/sign-in-form'); // Render the sign-in form view
});

server.get('/login/register-form', (req, res) => {
    res.render('login/register-form'); // Render the register form view
});
server.use((req, res, next) => {
    console.log('Request headers:', req.headers);
    next();
});
server.get('/cart', (req, res) => { // Add authentication to the cart route
    res.render('cart'); // Render the cart.ejs view
});

server.get('/map-of-stores', (req, res) => {
    res.render('map-of-stores'); // Render the map-of-stores view
});

// Database connection
const PORT = process.env.PORT || 8080;
connectDB(); // Connect to the database

server.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`); // Log each request
    next();
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Start the server and listen on the specified port
});


module.exports = server; // Export the server

