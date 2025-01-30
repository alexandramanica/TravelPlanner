const { body, param } = require("express-validator");

const validateTrip = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    body("budget")
        .notEmpty()
        .withMessage("Budget is required")
        .isNumeric()
        .withMessage("Budget must be a number"),
    body("startDate")
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601()
        .withMessage("Start date must be a valid ISO 8601 date"),
    body("endDate")
        .notEmpty()
        .withMessage("End date is required")
        .isISO8601()
        .withMessage("End date must be a valid ISO 8601 date")
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error("End date must be after the start date");
            }
            return true;
        }),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),
    body("ownerId")
        .notEmpty()
        .withMessage("Owner ID is required")
        .isString()
        .withMessage("Owner ID must be a string"),
];

const validateTripUpdates = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    body("budget")
        .notEmpty()
        .withMessage("Budget is required")
        .isNumeric()
        .withMessage("Budget must be a number"),    
    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date must be a valid ISO 8601 date"),
    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date must be a valid ISO 8601 date")
        .custom((value, { req }) => {
            if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
                throw new Error("End date must be after the start date");
            }
            return true;
        }),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("ownerId")
        .optional()
        .isString()
        .withMessage("Owner ID must be a string"),
];

const validateTripId = [
    param("tripId")
        .notEmpty()
        .withMessage("Trip ID is required")
        .isString()
        .withMessage("Trip ID must be a string"),
];

const validateGetUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .isLength({ min: 1 })
        .withMessage("User ID cannot be empty"),
];


module.exports = {
    validateTrip,
    validateTripUpdates,
    validateTripId,
    validateGetUser,
};
