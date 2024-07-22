const express = require('express');
const router = express.Router();
const {
    getAllshoes,
    createNewShoe,
    deleteShoeById,
    filterShoesByCategory,
    getShoeById,
    updateShoe,
    getShoeByIdAjax
    
} = require('../controllers/shoes');

router.get('/', getAllshoes);
router.post('/', createNewShoe);
router.delete('/:id', deleteShoeById);
router.get('/filter', filterShoesByCategory);
router.get('/:id', getShoeById);
router.put('/:id', updateShoe);
router.get('/:id/ajax', getShoeByIdAjax);

module.exports = router;