const express = require("express");
const server = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

const shoes = require("./routes/shoes");

// Middlewares
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Routes
server.get('/', (req, res) => {
    res.render('home'); // This will render views/home.ejs
});

server.get('/home', (req, res) => {
    res.render('home'); // This will render views/home.ejs
});
server.get('/men', (req, res) => {
    res.render('men-shoes'); // This will render views/home.ejs
});
server.get('/women', (req, res) => {
    res.render('women-shoes'); // This will render views/home.ejs
});
server.get('/kids', (req, res) => {
    res.render('kids-shoes'); // This will render views/home.ejs
});
server.get('/sale', (req, res) => {
    res.render('sale-shoes'); // This will render views/home.ejs
});
server.get('/cart', (req, res) => {
    res.render('cart'); // This will render views/home.ejs
});
server.use("/shoes", shoes);

// Database connection
const PORT = process.env.PORT || 8080;
connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
