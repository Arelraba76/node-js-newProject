const express = require("express");
const server = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const Shoe = require("./models/shoes"); // ייבוא מודל הנעליים

// Load environment variables from .env file
dotenv.config();

const shoesRoutes = require("./routes/shoes");

// Middlewares
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Routes
server.get('/', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // קבלת כל הנעליים ממסד הנתונים
        res.render('home', { shoes }); // שליחת הנתונים לתבנית home.ejs
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.get('/home', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // קבלת כל הנעליים ממסד הנתונים
        res.render('home', { shoes }); // שליחת הנתונים לתבנית home.ejs
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.get('/sign-in-form', (req, res) => {
    res.render('sign-in-form'); // מחזיר את טופס ההרשמה
});

server.get('/register-form', (req, res) => {
    res.render('register-form'); // מחזיר את טופס ההרשמה
});

server.get('/men', (req, res) => {
    res.render('men-shoes'); // This will render views/men-shoes.ejs
});

server.get('/women', (req, res) => {
    res.render('women-shoes'); // This will render views/women-shoes.ejs
});

server.get('/kids', (req, res) => {
    res.render('kids-shoes'); // This will render views/kids-shoes.ejs
});

server.get('/sale', (req, res) => {
    res.render('sale-shoes'); // This will render views/sale-shoes.ejs
});

server.get('/cart', (req, res) => {
    res.render('cart'); // This will render views/cart.ejs
});

server.use("/shoes", shoesRoutes);

// Database connection
const PORT = process.env.PORT || 8080;
connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
