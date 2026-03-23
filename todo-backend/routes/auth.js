const express = require("express");
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh); // this is called automatically after token expires
router.post("/logout", logout);

module.exports = router;
