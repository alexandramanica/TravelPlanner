const db = require("../config/db.js");
const { faker } = require('@faker-js/faker');
const logger = require("../config/logger.js");
const { fetchUsers, fetchUserById } = require("../controllers/userController.js");

const generateActivities = async (req, res) => {
    try {
        logger.info("Starting activity generation process...");

        // Fetch users
        const users = await fetchUsers();

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found to associate activities with" });
        }

        // Number of activities to generate
        const activityCount = 5;

        // Generate activities
        for (let i = 0; i < activityCount; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const activity = {
                name: faker.company.name(),
                description: faker.lorem.sentence(),
                category: faker.helpers.arrayElement([
                    "Outdoor",
                    "Indoor",
                    "Sports",
                    "Workshop",
                    "Other"
                ]),
                country: faker.location.country(),
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                disponibilityInfo: faker.lorem.sentence(),
                duration: faker.helpers.arrayElement(["1 hour", "2 hours", "Half-day", "Full-day"]),
                price: faker.number.float({ min: 0, max: 200, precision: 0.01 }),
                tags: faker.helpers.arrayElements(
                    ["Fun", "Educational", "Team-Building", "Adventure", "Relaxation", "Other"],
                    faker.number.int({ min: 1, max: 3 })
                ),
                tips: faker.lorem.sentence(),
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ownerID: randomUser.id,
                    ownerEmail: randomUser.email
                }

            };

            // Add activity to Firestore
            await db.collection("activities").add(activity);
            logger.info(`Generated activity: ${activity.name}`);
        }

        logger.info("Activity generation process completed successfully.");
        res.status(201).json({ message: "Activities added successfully." });
    } catch (error) {
        logger.error("Error generating activities:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getActivities = async (req, res) => {
    try {
        logger.info("Fetching all activities from the database...");

        // Fetch all activities from the 'activities' collection
        const querySnapshot = await db.collection("activities").get();

        // Check if the collection is empty
        if (querySnapshot.empty) {
            logger.warn("No activities found in the database.");
            return res.status(404).json({ message: "No activities found" });
        }

        // Map querySnapshot to an array of activity objects
        const activities = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${activities.length} activities successfully.`);
        res.status(200).json({ activities });
    } catch (error) {
        logger.error("Error fetching activities:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getActivity = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        logger.info(`Fetching activity with ID: ${activityId}`);

        // Fetch the activity document by ID
        const querySnapshot = await db.collection("activities").doc(activityId).get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Activity with ID ${activityId} not found.`);
            return res.status(404).json({ message: "Activity not found" });
        }

        // Prepare the activity object
        const activity = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
        };

        logger.info(`Activity with ID ${activityId} fetched successfully.`);
        res.status(200).json({ activity });
    } catch (error) {
        logger.error(`Error fetching activity with ID ${req.params.activityId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getActivityCount = async (req, res) => {
    try {
        logger.info("Fetching the total count of activities...");

        // Fetch all activities from the 'activities' collection
        const querySnapshot = await db.collection("activities").get();

        // Getting the count of activities
        const activityCount = querySnapshot.size;

        logger.info(`Total number of activities: ${activityCount}`);
        res.status(200).json({ count: activityCount });
    } catch (error) {
        logger.error("Error fetching the activity count:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const createActivity = async (req, res) => {
    try {
        logger.info("Adding new activity...");
        const { ownerId = null } = req.body;

        logger.info(`Owner ID: ${ownerId}`);

        // Fetch the owner details
        const owner = await fetchUserById(ownerId);

        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to add activity for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const newActivity = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            duration: req.body.duration,
            price: req.body.price,
            tags: req.body.tags,
            tips: req.body.tips,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ownerID: ownerId,
                ownerEmail: owner.email,
            },
        };

        // Add new activity to Firestore
        const addedActivity = await db.collection("activities").add(newActivity);

        logger.info(`New activity added with ID: ${addedActivity.id}`);
        res.status(201).json({ message: "Activity added successfully", id: addedActivity.id });
    } catch (error) {
        logger.error("Error adding new activity:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const userId = req.user.id;
        logger.info(`Deleting activity with ID: ${activityId}`);

        // Fetch the activity document by ID
        const activityRef = db.collection("activities").doc(activityId);
        const querySnapshot = await activityRef.get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Activity with ID ${activityId} not found.`);
            return res.status(404).json({ message: "Activity not found" });
        }

        // Double check if the user is the owner of the activity
        const activityData = querySnapshot.data();
        if (activityData.metadata.ownerID !== userId) {
            logger.warn(`User ${userId} is not authorized to delete activity with ID: ${activityId}`);
            return res.status(403).json({ message: "Forbidden: You are not the owner of this activity" });
        }

        // Delete the activity document
        await activityRef.delete();

        logger.info(`Activity with ID ${activityId} deleted successfully.`);
        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting activity with ID ${req.params.activityId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateActivity = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        
        const { ...updatedData } = req.body;
        const ownerId = updatedData.metadata.ownerID;

        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to update activity for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        logger.info(`Updating activity with ID: ${activityId}`);

        // Fetch the activity document by ID
        const activityRef = db.collection("activities").doc(activityId);
        const querySnapshot = await activityRef.get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Activity with ID ${activityId} not found.`);
            return res.status(404).json({ message: "Activity not found" });
        }

        // Fetch the owner details
        const owner = await fetchUserById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // Updates only certain fields that are passed in the request body
        updatedData.metadata = {
            ...querySnapshot.data().metadata,
            updatedAt: new Date().toISOString(),
        };

        // Update the activity document
        await activityRef.update(updatedData);

        logger.info(`Activity with ID ${activityId} updated successfully.`);
        res.status(200).json({
            message: "Attraction updated successfully",
            activity: { ...updatedData},
        });
    } catch (error) {
        logger.error(`Error updating activity with ID ${req.params.activityId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { generateActivities, getActivities, getActivity, getActivityCount, createActivity, deleteActivity, updateActivity };
