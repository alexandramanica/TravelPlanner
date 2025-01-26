const express = require("express");
const {
    validateActivity,
    validateActivityUpdates,
    validateActivityId
} = require("../middleware/validators/activityValidator.js");
const {
    generateActivities,
    createActivity,
    getActivity,
    getActivities,
    getActivityCount,
    updateActivity,
    deleteActivity
} = require("../controllers/activitiesController.js");
const handleValidation = require("../middleware/validationMiddleware.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const activityRouter = express.Router();

// Generate fake activities
activityRouter.post("/generate-fake-activities", generateActivities);

// Create a new activity
activityRouter.post(
    "/create-activity",
    verifyToken,
    validateActivity,
    handleValidation,
    createActivity
);

// Get all activities
activityRouter.get("/get-all-activities", verifyToken, getActivities);

// Get an activity by ID
activityRouter.get(
    "/get-activity/:activityId",
    verifyToken,
    validateActivityId,
    handleValidation,
    getActivity
);

// Get the total number of activities
activityRouter.get("/get-activity-count", 
    verifyToken, 
    getActivityCount);

// Update an activity
activityRouter.put(
    "/update-activity/:activityId",
    verifyToken,
    validateActivityUpdates,
    validateActivityId,
    handleValidation,
    updateActivity
);

// Delete an activity
activityRouter.delete(
    "/delete-activity/:activityId",
    verifyToken,
    validateActivityId,
    handleValidation,
    deleteActivity
);

module.exports = activityRouter;
