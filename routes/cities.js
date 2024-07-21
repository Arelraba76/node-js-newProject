const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.post('/add', cityController.addCity);

router.get('/', cityController.getAllCities);

router.delete('/:id', cityController.deleteCity);

router.get('/', cityController.getAllCities);

module.exports = router;