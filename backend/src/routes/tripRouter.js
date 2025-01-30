const express = require("express");
const {
    validateTrip,
    validateTripUpdates,
    validateTripId,
    validateGetUser, 
} = require("../middleware/validators/tripValidator.js");
const {
    createTrip,
    getTrips,
    getTrip,
    getTripCount,
    updateTrip,
    deleteTrip,
    addRestaurantToTrip,
    deleteRestaurantFromTrip,
    addActivityToTrip,
    deleteActivityFromTrip,
    addAttractionToTrip,
    deleteAttractionFromTrip,
    getUserTrips,
} = require("../controllers/tripsController.js");
const handleValidation = require("../middleware/validationMiddleware.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const tripRouter = express.Router();

// Create a new trip
tripRouter.post(
    "/create-trip",
    verifyToken,
    validateTrip,
    handleValidation,
    createTrip
);

// Get all trips
tripRouter.get("/get-all-trips", verifyToken, getTrips);

// Get a trip by ID
tripRouter.get(
    "/get-trip/:tripId",
    verifyToken,
    validateTripId,
    handleValidation,
    getTrip
);

// Get the number of trips
tripRouter.get("/get-trip-count", verifyToken, getTripCount);

// Update a trip
tripRouter.put(
    "/update-trip/:tripId",
    verifyToken,
    validateTripUpdates,
    validateTripId,
    handleValidation,
    updateTrip
);

// Delete a trip
tripRouter.delete(
    "/delete-trip/:tripId",
    verifyToken,
    validateTripId,
    handleValidation,
    deleteTrip
);

// Add a restaurant to a trip
tripRouter.put(
    "/:tripId/add-restaurant",
    verifyToken,
    validateTripId,
    handleValidation,
    addRestaurantToTrip
);

// Delete a restaurant from a trip
tripRouter.delete(
    "/:tripId/delete-restaurant/:restaurantId",
    verifyToken,
    validateTripId,
    handleValidation,
    deleteRestaurantFromTrip
);

// Add an activity to a trip
tripRouter.put(
    "/:tripId/add-activity",
    verifyToken,
    validateTripId,
    handleValidation,
    addActivityToTrip
);

// Delete an activity from a trip
tripRouter.delete(
    "/:tripId/delete-activity/:activityId",
    verifyToken,
    validateTripId,
    handleValidation,
    deleteActivityFromTrip
);

// Add an attraction to a trip
tripRouter.put(
    "/:tripId/add-attraction",
    verifyToken,
    validateTripId,
    handleValidation,
    addAttractionToTrip
);

// Delete an attraction from a trip
tripRouter.delete(
    "/:tripId/delete-attraction/:attractionId",
    verifyToken,
    validateTripId,
    handleValidation,
    deleteAttractionFromTrip
);

// Get all trips for a user
tripRouter.get(
    "/get-user-trips/:userId", 
    verifyToken, 
    validateGetUser,
    handleValidation,
    getUserTrips);

module.exports = tripRouter;
