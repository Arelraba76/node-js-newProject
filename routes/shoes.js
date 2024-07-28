const express = require('express');
const router = express.Router();
const {
    getAllshoes,
    createNewShoe,
    deleteShoeById,
    filterShoesByCategory,
    getShoeById,
    updateShoe,
    getShoeByIdAjax,

} = require('../controllers/shoes');

// Routes מסודרים מהספציפי ביותר לכללי ביותר
router.get('/filter', filterShoesByCategory);
router.get('/:id/ajax', getShoeByIdAjax);
router.get('/:id', getShoeById);
router.put('/:id', updateShoe);
router.delete('/:id', deleteShoeById);
router.get('/', getAllshoes);
router.post('/', createNewShoe);
// routes/shoes.js

module.exports = router;