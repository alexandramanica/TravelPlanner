const { body, param } = require("express-validator");

const validateActivity = [
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
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isString()
        .withMessage("Category must be a string")
        .isIn(["Outdoor", "Indoor", "Sports", "Workshop", "Other"])
        .withMessage("Category must be one of Outdoor, Indoor, Sports, Workshop, Other"),
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
    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage("Date must be a valid ISO 8601 string"),
    body("duration")
        .optional()
        .isString()
        .withMessage("Duration must be a string"),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
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

const validateActivityUpdates = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("category")
        .optional()
        .isString()
        .withMessage("Category must be a string")
        .isIn(["Outdoor", "Indoor", "Sports", "Workshop", "Other"])
        .withMessage("Category must be one of Outdoor, Indoor, Sports, Workshop, Other"),
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
    body("date")
        .optional()
        .isISO8601()
        .withMessage("Date must be a valid ISO 8601 string"),
    body("duration")
        .optional()
        .isString()
        .withMessage("Duration must be a string"),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
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

const validateActivityId = [
    param("activityId")
        .notEmpty()
        .withMessage("Activity ID is required")
        .isString()
        .withMessage("Activity ID must be a string"),
];

module.exports = {
    validateActivity,
    validateActivityUpdates,
    validateActivityId,
};
