const express = require("express");
const {
    validateRestaurant,
    validateRestaurantUpdates,
    validateRestaurantId
} = require("../middleware/validators/restaurantValidator.js");
const {
    generateRestaurants,
    createRestaurant,
    getRestaurant,
    getRestaurants,
    updateRestaurant,
    deleteRestaurant
} = require("../controllers/restaurantsController.js");
const handleValidation = require("../middleware/validationMiddleware.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const restaurantRouter = express.Router();

// Generate fake restaurants
restaurantRouter.post("/generate-fake-restaurants", generateRestaurants);

// Create a new restaurant
restaurantRouter.post(
    "/create-restaurant",
    verifyToken,
    validateRestaurant,
    handleValidation,
    createRestaurant
);

// Get all restaurants
restaurantRouter.get("/get-all-restaurants", verifyToken, getRestaurants);

// Get a restaurant by ID
restaurantRouter.get(
    "/get-restaurant/:restaurantId",
    verifyToken,
    validateRestaurantId,
    handleValidation,
    getRestaurant
);

// Update a restaurant
restaurantRouter.put(
    "/update-restaurant/:restaurantId",
    verifyToken,
    validateRestaurantUpdates,
    validateRestaurantId,
    handleValidation,
    updateRestaurant
);

// Delete a restaurant
restaurantRouter.delete(
    "/delete-restaurant/:restaurantId",
    verifyToken,
    validateRestaurantId,
    handleValidation,
    deleteRestaurant
);

module.exports = restaurantRouter;
