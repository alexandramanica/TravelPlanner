const { body, param } = require("express-validator");

// Validation for fetching a single user
const validateGetUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .isLength({ min: 1 })
        .withMessage("User ID cannot be empty"),
];

module.exports = {
    validateGetUser
};

