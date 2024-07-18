    
const express = require("express");
const router = express.Router();
const usercontroller = require('../cotrollers/user.js');

router.post("/register",usercontroller.createNewUser);
router.get("/register", usercontroller.getRegister);
router.get("/",usercontroller.getAllUsers);
router.get("/login", usercontroller.getLogin);
router.post("/login", usercontroller.loginUser);
router.delete("/:id",usercontroller.deleteUserById);
router.put("/:id",usercontroller.updateUserById);
router.get("/:id",usercontroller.getUserById);

module.exports = router