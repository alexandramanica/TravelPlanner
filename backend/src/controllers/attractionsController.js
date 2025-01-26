const db = require("../config/db.js");
const { faker } = require('@faker-js/faker');
const logger = require("../config/logger.js");
const axios = require("axios");
require("dotenv").config();
const {fetchUsers, fetchUserById} = require("../controllers/userController.js");

const generateAttractions = async (req, res) => {
    try {
        logger.info("Starting attraction generation process...");

        // Fetch users
        const users = await fetchUsers();

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found to associate attractions with" });
        }

        // Number of attractions to generate
        const attractionCount = 5;

        // Generate attractions
        for (let i = 0; i < attractionCount; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const attraction = {
                name: faker.company.name(),
                description: faker.lorem.sentence(),
                type: faker.helpers.arrayElement([
                    "Cultural",
                    "Adventure",
                    "Nature",
                    "Historical",
                    "Entertainment",
                    "Other"
                ]),
                country: faker.location.country(),
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                openingHours: "9:00 AM - 6:00 PM",
                entryFee: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
                facilities: faker.helpers.arrayElements([
                    "Restrooms",
                    "Parking",
                    "Wi-Fi",
                    "Food and Beverage",
                    "Gift Shop",
                    "Other"
                ], faker.number.int({ min: 1, max: 3 })),
                tags: faker.helpers.arrayElements(
                    ["Art", "History", "Family-Friendly", "Adventure", 
                        "Romantic", "Pet-Friendly", "Nature", "Other"],
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

            // Add attraction to Firestore
            await db.collection("attractions").add(attraction);
            logger.info(`Generated attraction: ${attraction.name}`);
        }

        logger.info("Attraction generation process completed successfully.");
        res.status(201).json({ message: "Attractions added successfully." });
    } catch (error) {
        logger.error("Error generating attractions:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAttractions = async (req, res) => {
    try {
        logger.info("Fetching all attractions from the database...");

        // Fetch all attractions from the 'attractions' collection
        const querySnapshot = await db.collection("attractions").get();

        // Check if the collection is empty
        if (querySnapshot.empty) {
            logger.warn("No attractions found in the database.");
            return res.status(404).json({ message: "No attractions found" });
        }

        // Map querySnapshot to an array of attraction objects
        const attractions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${attractions.length} attractions successfully.`);
        res.status(200).json({ attractions });
    } catch (error) {
        logger.error("Error fetching attractions:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAttraction = async (req, res) => {
    try {
        const attractionId = req.params.attractionId;
        logger.info(`Fetching attraction with ID: ${attractionId}`);

        // Fetch the attraction document by ID
        const querySnapshot = await db.collection("attractions").doc(attractionId).get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Attraction with ID ${attractionId} not found.`);
            return res.status(404).json({ message: "Attraction not found" });
        }

        // Prepare the attraction object
        const attraction = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
        };

        logger.info(`Attraction with ID ${attractionId} fetched successfully.`);
        res.status(200).json({ attraction });
    } catch (error) {
        logger.error(`Error fetching attraction with ID ${req.params.attractionId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAttractionCount = async (req, res) => {
    try {
        logger.info("Fetching the total count of attractions...");

        // Fetch all attractions from the 'attractions' collection
        const querySnapshot = await db.collection("attractions").get();

        // Getting the count of attractions
        const attractionCount = querySnapshot.size;

        logger.info(`Total number of attractions: ${attractionCount}`);
        res.status(200).json({ count: attractionCount });
    } catch (error) {
        logger.error("Error fetching the attraction count:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const createAttraction = async (req, res) => {
    try {
        logger.info("Adding new attraction...");
        const { ownerId = null } = req.body;
       
        logger.info(`Owner ID: ${ownerId}`);

        // Fetch the owner details
        const owner = await fetchUserById(ownerId);
   
        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to add attraction for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const newAttraction = {
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            openingHours: req.body.openingHours,
            entryFee: req.body.entryFee,
            facilities: req.body.facilities,
            tags: req.body.tags,
            tips: req.body.tips,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ownerID: ownerId,
                ownerEmail: owner.email,
            },
        };
        

        // Add new attraction to Firestore
        const addedAttraction = await db.collection("attractions").add(newAttraction);

        logger.info(`New attraction added with ID: ${addedAttraction.id}`);
        res.status(201).json({ message: "Attraction added successfully", id: addedAttraction.id });
    } catch (error) {
        logger.error("Error adding new attraction:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteAttraction = async (req, res) => {
    try {
        const attractionId = req.params.attractionId;
        const userId = req.user.id;
        logger.info(`Deleting attraction with ID: ${attractionId}`);

        // Fetch the attraction document by ID
        const attractionRef = db.collection("attractions").doc(attractionId);
        const querySnapshot = await attractionRef.get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Attraction with ID ${attractionId} not found.`);
            return res.status(404).json({ message: "Attraction not found" });
        }

        //Double check if the user is the owner of the attraction
        const attractionData = querySnapshot.data();
        if (attractionData.metadata.ownerID !== userId) {
            logger.warn(`User ${userId} is not authorized to delete attraction with ID: ${attractionId}`);
            return res.status(403).json({ message: "Forbidden: You are not the owner of this attraction" });
        }

        // Delete the attraction document
        await attractionRef.delete();

        logger.info(`Attraction with ID ${attractionId} deleted successfully.`);
        res.status(200).json({ message: "Attraction deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting attraction with ID ${req.params.attractionId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateAttraction = async (req, res) => {
    try {
        const attractionId = req.params.attractionId;
        
        const { ...updatedData } = req.body;
        const ownerId = updatedData.metadata.ownerID;
        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to add attraction for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        console.log(ownerId);

        logger.info(`Updating attraction with ID: ${attractionId}`);

        // Fetch the attraction document by ID
        const attractionRef = db.collection("attractions").doc(attractionId);
        const querySnapshot = await attractionRef.get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Attraction with ID ${attractionId} not found.`);
            return res.status(404).json({ message: "Attraction not found" });
        }

        // Fetch the owner details
        const owner = await fetchUserById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        //Updates only certain fields that are passed in the request body
        updatedData.metadata = {
            ...querySnapshot.data().metadata,
            updatedAt: new Date().toISOString(),
        };

        // Update the attraction document
        await attractionRef.update(updatedData);

        logger.info(`Attraction with ID ${attractionId} updated successfully.`);
        res.status(200).json({
            message: "Attraction updated successfully",
            attraction: { ...updatedData},
        });

    } catch (error) {
        logger.error(`Error updating attraction with ID ${req.params.attractionId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserAttractions = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from route parameter
        logger.info(`Fetching attractions for user with ID: ${userId}`);

        // Query the database for attractions where metadata.ownerID matches userId
        const querySnapshot = await db.collection("attractions")
            .where("metadata.ownerID", "==", userId)
            .get();

        // Check if any attractions were found
        if (querySnapshot.empty) {
            logger.warn(`No attractions found for user with ID: ${userId}`);
            return res.status(404).json({ message: "No attractions found for this user" });
        }

        // Map the results to an array of attraction objects
        const attractions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${attractions.length} attractions for user with ID: ${userId}`);
        res.status(200).json({ attractions });
    } catch (error) {
        logger.error(`Error fetching attractions for user with ID: ${req.params.userId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { generateAttractions, getAttractions, getAttraction, getAttractionCount, createAttraction, deleteAttraction, updateAttraction, getUserAttractions };
