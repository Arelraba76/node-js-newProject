const express = require('express');
const router = express.Router();

// נתיב לטעינת טופס Add Shoe
router.get('/add-shoe', (req, res) => {
    res.render('login/dashboard/add-shoe');
});

// נתיבים נוספים
router.get('/manage-shoes', (req, res) => {
    res.render('login/dashboard/manage-shoes');
});

router.get('/store-management', (req, res) => {
    res.render('login/dashboard/store-management');
});

router.get('/add-user', (req, res) => {
    res.render('login/dashboard/add-user');
});

router.get('/user-management', (req, res) => {
    res.render('login/dashboard/user-management');
});

module.exports = router;
