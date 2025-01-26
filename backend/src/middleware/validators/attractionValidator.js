const { body, param } = require("express-validator");

const validateAttraction = [
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
    body("type")
        .notEmpty()
        .withMessage("Type is required")
        .isString()
        .withMessage("Type must be a string")
        .isIn(["Cultural", "Adventure", "Nature", "Historical", "Entertainment" , "Other"])
        .withMessage("Type must be one of Cultural, Adventure, Historical, Nature, Entertainment or Other"),
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
    body("entryFee")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Entry fee must be a positive number"),
    body("facilities")
        .optional()
        .isArray()
        .withMessage("Facilities must be an array of strings"),
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array of strings"),
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

const validateAttractionUpdates = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("type")
        .optional()
        .isString()
        .withMessage("Type must be a string")
        .isIn(["Cultural", "Adventure", "Nature", "Historical", "Entertainment" , "Other"])
        .withMessage("Type must be one of Cultural, Adventure, Historical, Nature, Entertainment or Other"),
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
    body("entryFee")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Entry fee must be a positive number"),
    body("facilities")
        .optional()
        .isArray()
        .withMessage("Facilities must be an array of strings"),
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array of strings"),
    body("tips")
        .optional()
        .isString()
        .withMessage("Tips must be a string"),
    body("ownerId")
        .optional()
        .isString()
        .withMessage("Owner ID must be a string"),
];


const validateAttractionId = [
    param("attractionId")
        .notEmpty()
        .withMessage("Attraction ID is required")
        .isString()
        .withMessage("Attraction ID must be a string"),
];

const validateGetUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .isLength({ min: 1 })
        .withMessage("User ID cannot be empty"),
];


module.exports = {
    validateAttraction, validateAttractionUpdates, validateAttractionId, validateGetUser
};
