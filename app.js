const express = require("express");
const server = express();
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser');
const Shoe = require("./models/shoes");

// Middleware to parse JSON bodies
server.use(express.json());
// Middleware to parse URL-encoded bodies
server.use(express.urlencoded({ extended: true }));

const requireAuth = require('./middlewares/requireAuth');
const csurf = require('csurf');

// Middleware to parse cookies
server.use(cookieParser());

// Load environment variables from .env file
dotenv.config();

const shoesRoutes = require("./routes/shoes");
const userRoutes = require("./routes/user");

// Use user routes for handling API requests related to users
server.use("/api/users", userRoutes);

// Route for the login dashboard, requires authentication
server.get('/login/dashboard', requireAuth, (req, res) => {
    console.log('Dashboard request, user:', req.user);
    if (req.user && req.user.isAdmin) {
        res.render('login/dashboard');
    } else {
        res.status(403).send('Access Denied');
    }
});

const csrfProtection = csurf({ cookie: true });
server.use(csrfProtection);

// Middleware to enable CORS
server.use(cors());
// Middleware to parse JSON bodies
server.use(bodyParser.json());
// Middleware to parse URL-encoded bodies
server.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
server.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Route for the home page
server.get('/', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // Get all shoes from the database
        res.render('home', { shoes }); // Send the data to the home.ejs template
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Another route for the home page (duplicate, consider removing one)
server.get('/home', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // Get all shoes from the database
        res.render('home', { shoes }); // Send the data to the home.ejs template
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const cityRoutes = require('./routes/cities'); // Import the cities router

// Use user routes for handling API requests related to users (duplicate, consider removing one)
server.use("/api/users", userRoutes);
// Use shoe routes for handling requests related to shoes
server.use("/shoes", shoesRoutes);
// Use city routes for handling API requests related to cities
server.use('/api/cities', cityRoutes);

// Route for the login sign-in form
server.get('/login/sign-in-form', (req, res) => {
    res.render('login/sign-in-form'); // Render the sign-in form
});

// Route for the login registration form
server.get('/login/register-form', (req, res) => {
    res.render('login/register-form'); // Render the registration form
});

// Route for men's shoes
server.get('/men', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Men' }); // Get all men's shoes from the database
        res.render('men-shoes', { shoes }); // Send the data to the men-shoes.ejs template
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route for women's shoes
server.get('/women', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Women' }); // Get all women's shoes from the database
        res.render('women-shoes', { shoes }); // Send the data to the women-shoes.ejs template
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route for kids' shoes
server.get('/kids', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Kids' }); // Get all kids' shoes from the database
        res.render('kids-shoes', { shoes }); // Send the data to the kids-shoes.ejs template
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route for shoes on sale
server.get('/sale', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Sale' }); // Get all sale shoes from the database
        res.render('sale-shoes', { shoes }); // Send the data to the sale-shoes.ejs template
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route for the shopping cart
server.get('/cart', (req, res) => {
    res.render('cart'); // This will render views/cart.ejs
});

// Route for the map of stores
server.get('/map-of-stores', (req, res) => {
    res.render('map-of-stores', { csrfToken: req.csrfToken() }); // Render the map of stores with CSRF token
});

// Add this route to provide the CSRF token
server.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

const PORT = process.env.PORT || 8080;
// Connect to the database
connectDB();

// Middleware to log requests
server.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
