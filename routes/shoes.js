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
    filterShoes,

    searchShoes

} = require('../controllers/shoes');

// Routes מסודרים מהספציפי ביותר לכללי ביותר
router.get('/search', searchShoes);
//router.get('/filter', filterShoes);
router.get('/:id/ajax', getShoeByIdAjax);
router.get('/:id', getShoeById);
router.put('/:id', updateShoe);
router.delete('/:id', deleteShoeById);
router.get('/', getAllshoes);
router.post('/', createNewShoe);


module.exports = router;