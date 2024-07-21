const express = require("express");
const server = express();
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser');
const Shoe = require("./models/shoes"); // ייבוא מודל הנעליים
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const requireAuth = require('./middlewares/requireAuth');
const csurf = require('csurf');
server.use(cookieParser());
// Load environment variables from .env file
dotenv.config();

const shoesRoutes = require("./routes/shoes");

const userRoutes = require("./routes/user");
server.use("/api/users", userRoutes);

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
const cityRoutes = require('./routes/cities'); // ייבוא הראוטר של הערים
server.use("/api/users", userRoutes);
server.use("/shoes", shoesRoutes);
server.use('/api/cities', cityRoutes); // 

server.get('/login/sign-in-form', (req, res) => {
    res.render('login/sign-in-form'); // מחזיר את טופס ההרשמה
});

server.get('/login/register-form', (req, res) => {
    res.render('login/register-form'); // מחזיר את טופס ההרשמה
});

server.get('/men', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Men' }); // קבלת כל הנעליים לגברים ממסד הנתונים
        res.render('men-shoes', { shoes }); // שליחת הנתונים לתבנית men-shoes.ejs
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.get('/women', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Women' }); // קבלת כל הנעליים לנשים ממסד הנתונים
        res.render('women-shoes', { shoes }); // שליחת הנתונים לתבנית women-shoes.ejs
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.get('/kids', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Kids' }); // קבלת כל הנעליים לילדים ממסד הנתונים
        res.render('kids-shoes', { shoes }); // שליחת הנתונים לתבנית kids-shoes.ejs
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.get('/sale', async (req, res) => {
    try {
        const shoes = await Shoe.find({ category: 'Sale' }); // קבלת כל הנעליים במבצע ממסד הנתונים
        res.render('sale-shoes', { shoes }); // שליחת הנתונים לתבנית sale-shoes.ejs
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.get('/cart', (req, res) => {
    res.render('cart'); // This will render views/cart.ejs
});

server.get('/map-of-stores', (req, res) => {
    res.render('map-of-stores', { csrfToken: req.csrfToken() });
});

server.use("/shoes", shoesRoutes);

// Add this route to provide the CSRF token
server.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

const PORT = process.env.PORT || 8080;
connectDB();

server.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
  });

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = server;
