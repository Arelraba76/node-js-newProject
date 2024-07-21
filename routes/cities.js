const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// Add a new city
router.post('/add', cityController.addCity);

// Retrieve all cities
router.get('/', cityController.getAllCities);

// Delete a city by ID
router.delete('/:id', cityController.deleteCity);

// Duplicate route to retrieve all cities (consider removing one)
router.get('/', cityController.getAllCities);

module.exports = router;
