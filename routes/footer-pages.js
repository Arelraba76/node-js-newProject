const express = require('express');
const router = express.Router();

// Define routes for footer pages
const footerPages = [
    'orderstatus',
    'shipping',
    'returns',
    'contact',
    'about',
    'careers',
    'investors',
    'sustainability'
];
footerPages.forEach(page => {
    router.get(`/${page}`, (req, res) => {
        res.render(`footer-pages/${page}`);
    });
})

module.exports = router;