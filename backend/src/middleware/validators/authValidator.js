const { body } = require("express-validator");

// Validation for user registration
const validateRegisterUser = [
    body("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isString()
        .withMessage("First name must be a string"),
    body("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isString()
        .withMessage("Last name must be a string"),
    body("email")
        .isEmail()
        .withMessage("A valid email address is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

// Validation for user login
const validateLoginUser = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("A valid email address is required"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

module.exports = {
    validateRegisterUser,
    validateLoginUser,
};
