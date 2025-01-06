const express = require("express");
const { validateAttraction, validateAttractionUpdates, validateAttractionId } = require("../middleware/validators/attractionValidator.js");
const {
    generateAttractions,
    createAttraction,
    getAttraction,
    getAttractions,
    updateAttraction,
    deleteAttraction
} = require("../controllers/attractionsController.js");
const handleValidation = require("../middleware/validationMiddleware.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const attractionRouter = express.Router();

// Create fake attractions - 10
attractionRouter.post("/generate-fake-attractions", generateAttractions);

// Create a new attraction
attractionRouter.post(
    "/create-attraction",
    verifyToken,
    validateAttraction, 
    handleValidation,
    createAttraction
);

// Get all attractions
attractionRouter.get("/get-all-attractions", verifyToken, getAttractions);

// Get an attraction by ID
attractionRouter.get(
    "/get-attraction/:attractionId", 
    verifyToken, 
    validateAttractionId, 
    handleValidation, 
    getAttraction);

// Update an attraction
attractionRouter.put(
    "/update-attraction/:attractionId",
    verifyToken,
    validateAttractionUpdates, 
    validateAttractionId,
    handleValidation,
    updateAttraction
);

// Delete an attraction
attractionRouter.delete(
    "/delete-attraction/:attractionId", 
    verifyToken,
    validateAttractionId, 
    handleValidation, 
    deleteAttraction);

module.exports = attractionRouter;
