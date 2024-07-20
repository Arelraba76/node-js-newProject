const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// הוספת עיר חדשה
router.post('/add', cityController.addCity);

// שליפת כל הערים
router.get('/', cityController.getAllCities);

// מחיקת עיר לפי ID
router.delete('/:id', cityController.deleteCity);

router.get('/', cityController.getAllCities);

module.exports = router;
