// routes/user.js
const express = require("express");
const router = express.Router();
const usercontroller = require('../controllers/user.js');
const requireAuth = require('../middlewares/requireAuth.js');

// routes/users.js
router.post('/update', requireAuth, async (req, res) => {
    try {
        const { oldUserId, ...updateData } = req.body;

        // אם יש סיסמה חדשה, יש להצפין אותה
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // מצא את המשתמש הישן
        const oldUser = await User.findById(oldUserId);
        if (!oldUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // יצירת משתמש חדש עם הנתונים המעודכנים
        const newUser = new User({
            ...updateData,
            shoesPurchases: oldUser.shoesPurchases
        });
        await newUser.save();

        // העתקת העגלה מהמשתמש הישן לחדש
        const oldCart = await Cart.findOne({ userId: oldUserId });
        if (oldCart) {
            const newCart = new Cart({
                userId: newUser._id,
                items: oldCart.items
            });
            await newCart.save();
            await Cart.findByIdAndDelete(oldCart._id);
        }

        // מחיקת המשתמש הישן
        await User.findByIdAndDelete(oldUserId);

        res.json({ message: 'User updated successfully', user: newUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post("/register",usercontroller.createNewUser);
router.get("/register", usercontroller.getRegister);
router.get("/",usercontroller.getAllUsers);
router.get("/login", usercontroller.getLogin);
router.post("/login", usercontroller.loginUser);
router.delete("/:id",usercontroller.deleteUserById);
router.get("/cart", requireAuth, usercontroller.getCart);
router.post("/cart/remove", requireAuth, usercontroller.removeFromCart);
router.post("/checkout", requireAuth, usercontroller.checkout);

router.put("/:id",usercontroller.updateUserById);///cart put above
router.get("/:id",usercontroller.getUserById);
router.post("/logout", usercontroller.logoutUser);
router.get("login/dashboard", requireAuth, usercontroller.getDashboard);
router.get("/dashboard", requireAuth, usercontroller.getDashboard);
router.post("/purchase", requireAuth, usercontroller.purchaseShoe);
router.get('/api/users/:id/purchases', requireAuth, usercontroller.getUserPurchases);
router.get('/:id/purchases', requireAuth, usercontroller.getUserPurchases);
router.post('/purchase', requireAuth, usercontroller.purchaseShoe);
router.post("/cart/add", requireAuth, usercontroller.addToCart);




module.exports = router