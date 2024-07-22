    
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
router.get("/dashboard", requireAuth, usercontroller.getDashboard);

module.exports = router