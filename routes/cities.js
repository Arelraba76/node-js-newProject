const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.post('/', cityController.addCity);
router.get('/', cityController.getAllCities);
router.get('/:id', cityController.getCityById);
router.put('/:id', cityController.updateCity);
router.delete('/:id', cityController.deleteCity);
router.get('/search', cityController.searchCities);

module.exports = router;
