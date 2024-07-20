const express = require('express');
const router = express.Router();
const {
    getAllshoes,
    createNewShoe,
    deleteShoeById,
    filterShoesByCategory,
    getShoeById
} = require('../controllers/shoes');

router.get('/', getAllshoes);
router.post('/', createNewShoe);
router.delete('/:id', deleteShoeById);
router.get('/filter', filterShoesByCategory);
router.get('/category/:category', filterShoesByCategory); // Ensure this route is defined
router.get('/:id', getShoeById);

module.exports = router;
