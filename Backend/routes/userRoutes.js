const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCredentials } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/credentials", protect, getCredentials);

module.exports = router;
