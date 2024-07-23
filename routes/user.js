const express = require("express");
const router = express.Router();
const usercontroller = require('../controllers/user.js');
const requireAuth = require('../middlewares/requireAuth');

router.post("/register",usercontroller.createNewUser);
router.get("/register", usercontroller.getRegister);
router.get("/",usercontroller.getAllUsers);
router.get("/login", usercontroller.getLogin);
router.post("/login", usercontroller.loginUser);
router.delete("/:id",usercontroller.deleteUserById);
router.put("/:id",usercontroller.updateUserById);
router.get("/:id",usercontroller.getUserById);
router.post("/logout", usercontroller.logoutUser);
router.get("login/dashboard", requireAuth, usercontroller.getDashboard);
router.post("/purchase", requireAuth, usercontroller.purchaseShoe);
router.get('/api/users/:id/purchases', requireAuth, usercontroller.getUserPurchases);
router.get('/:id/purchases', requireAuth, usercontroller.getUserPurchases);
router.post("/cart/add", requireAuth, usercontroller.addToCart);
router.get("/cart", requireAuth, usercontroller.getCart);
router.post("/checkout", requireAuth, usercontroller.checkout);

module.exports = router