const express = require("express");
const { validateGetUser } = require("../middleware/validators/userValidator.js");
const { generateUsers, getUsers, getUser } = require("../controllers/userController.js");
const handleValidation = require("../middleware/validationMiddleware.js");

const userRouter = express.Router();

// Route for generating users
userRouter.post("/generate-fake-users", generateUsers);

// // Route for fetching all users
userRouter.get("/get-all-users", getUsers);

// // Route for fetching a single user by ID
userRouter.get("/get-user/:userId", validateGetUser, handleValidation, getUser);

module.exports = userRouter;
