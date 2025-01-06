const express = require("express");
const { validateRegisterUser, validateLoginUser } = require("../middleware/validators/authValidator.js");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController.js");
const handleValidation = require("../middleware/validationMiddleware.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const authRouter = express.Router();

// Route for registering a user
authRouter.post("/register", validateRegisterUser, handleValidation, registerUser);

// Route for logging in a user
authRouter.post("/login", validateLoginUser, handleValidation, loginUser);

// Route for logging out a user
authRouter.post("/logout", verifyToken, logoutUser);

module.exports = authRouter;
