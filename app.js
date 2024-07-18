// ייבוא החבילות הנדרשות
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");
const shoes = require("./routes/shoes");

// טעינת המשתנים מקובץ .env
dotenv.config();

// הגדרת אובייקט האפליקציה של Express
const app = express();

// קביעת נקודת קצה בסיסית
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// שימוש בנתיבים שהוגדרו
app.use('/home', shoes);

// הגדרת האפליקציה להאזין לפורט שהוגדר בקובץ .env או לפורט 3000 כברירת מחדל
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connectDB();
