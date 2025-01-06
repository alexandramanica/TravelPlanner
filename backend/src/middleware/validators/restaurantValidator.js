const { body, param } = require("express-validator");

const validateRestaurant = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),
    body("cuisine")
        .notEmpty()
        .withMessage("Cuisine is required")
        .isString()
        .withMessage("Cuisine must be a string")
        .isIn(["Italian", "Chinese", "Mexican", "Indian", "American", "Other"])
        .withMessage("Cuisine must be one of Italian, Chinese, Mexican, Indian, American, Other"),
        body("country")
        .notEmpty()
        .withMessage("Country is required")
        .isString()
        .withMessage("Country must be a string"),
    body("city")
        .notEmpty()
        .withMessage("City is required")
        .isString()
        .withMessage("City must be a string"),
    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address must be a string"),
    body("openingHours")
        .notEmpty()
        .withMessage("Opening hours are required")
        .isString()
        .withMessage("Opening hours must be a string"),
    body("averageCost")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Average cost must be a positive number"),
    body("rating")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array of strings"),
    body("tags.*")
        .optional()
        .isString()
        .withMessage("Each tag must be a string"),
    body("tips")
        .optional()
        .isString()
        .withMessage("Tips must be a string"),
    body("ownerId")
        .notEmpty()
        .withMessage("Owner ID is required")
        .isString()
        .withMessage("Owner ID must be a string"),
];

const validateRestaurantUpdates = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("cuisine")
        .optional()
        .isString()
        .withMessage("Cuisine must be a string")
        .isIn(["Italian", "Chinese", "Mexican", "Indian", "American", "Other"])
        .withMessage("Cuisine must be one of Italian, Chinese, Mexican, Indian, American, Other"),
    body("country")
        .optional()
        .isString()
        .withMessage("Country must be a string"),
    body("city")
        .optional()
        .isString()
        .withMessage("City must be a string"),
    body("address")
        .optional()
        .isString()
        .withMessage("Address must be a string"),
    body("openingHours")
        .optional()
        .isString()
        .withMessage("Opening hours must be a string"),
    body("averageCost")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Average cost must be a positive number"),
    body("rating")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array of strings"),
    body("tags.*")
        .optional()
        .isString()
        .withMessage("Each tag must be a string"),
    body("tips")
        .optional()
        .isString()
        .withMessage("Tips must be a string"),
    body("ownerId")
        .optional()
        .isString()
        .withMessage("Owner ID must be a string"),
];

const validateRestaurantId = [
    param("restaurantId")
        .notEmpty()
        .withMessage("Restaurant ID is required")
        .isString()
        .withMessage("Restaurant ID must be a string"),
];

module.exports = {
    validateRestaurant,
    validateRestaurantUpdates,
    validateRestaurantId,
};
