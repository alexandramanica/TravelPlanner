const { body, param } = require("express-validator");

// Validation for fetching a single user
const validateGetUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .isLength({ min: 1 })
        .withMessage("User ID cannot be empty"),
];

// Validation for creating a user (e.g., during registration)
const validateRegisterUser = [
    body("firstName")
        .notEmpty()
        .withMessage("First name is required"),
    body("lastName")
        .notEmpty()
        .withMessage("Last name is required"),
    body("email")
        .isEmail()
        .withMessage("Email must be valid"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

module.exports = {
    validateGetUser, // Export as is
    validateRegisterUser,
};

