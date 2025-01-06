const db = require("../config/db.js");
const { faker } = require('@faker-js/faker');
const logger = require("../config/logger.js");
const { fetchUsers, fetchUserById } = require("../controllers/userController.js");

const generateRestaurants = async (req, res) => {
    try {
        logger.info("Starting restaurant generation process...");

        // Fetch users
        const users = await fetchUsers();

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found to associate restaurants with" });
        }

        // Number of restaurants to generate
        const restaurantCount = 5;

        // Generate restaurants
        for (let i = 0; i < restaurantCount; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const restaurant = {
                name: faker.company.name(),
                description: faker.lorem.sentence(),
                cuisine: faker.helpers.arrayElement([
                    "Italian",
                    "Chinese",
                    "Mexican",
                    "Indian",
                    "American",
                    "Other"
                ]),
                country: faker.location.country(),
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                openingHours: "10:00 AM - 11:00 PM",
                averageCost: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
                tags: faker.helpers.arrayElements(
                    ["Family-Friendly", "Romantic", "Fine Dining", "Casual", "Takeout", "Other"],
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

            // Add restaurant to Firestore
            await db.collection("restaurants").add(restaurant);
            logger.info(`Generated restaurant: ${restaurant.name}`);
        }

        logger.info("Restaurant generation process completed successfully.");
        res.status(201).json({ message: "Restaurants added successfully." });
    } catch (error) {
        logger.error("Error generating restaurants:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getRestaurants = async (req, res) => {
    try {
        logger.info("Fetching all restaurants from the database...");

        // Fetch all restaurants from the 'restaurants' collection
        const querySnapshot = await db.collection("restaurants").get();

        // Check if the collection is empty
        if (querySnapshot.empty) {
            logger.warn("No restaurants found in the database.");
            return res.status(404).json({ message: "No restaurants found" });
        }

        // Map querySnapshot to an array of restaurant objects
        const restaurants = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${restaurants.length} restaurants successfully.`);
        res.status(200).json({ restaurants });
    } catch (error) {
        logger.error("Error fetching restaurants:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        logger.info(`Fetching restaurant with ID: ${restaurantId}`);

        // Fetch the restaurant document by ID
        const querySnapshot = await db.collection("restaurants").doc(restaurantId).get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Restaurant with ID ${restaurantId} not found.`);
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Prepare the restaurant object
        const restaurant = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
        };

        logger.info(`Restaurant with ID ${restaurantId} fetched successfully.`);
        res.status(200).json({ restaurant });
    } catch (error) {
        logger.error(`Error fetching restaurant with ID ${req.params.restaurantId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createRestaurant = async (req, res) => {
    try {
        logger.info("Adding new restaurant...");
        const { ownerId = null } = req.body;

        logger.info(`Owner ID: ${ownerId}`);

        // Fetch the owner details
        const owner = await fetchUserById(ownerId);

        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to add restaurant for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const newRestaurant = {
            name: req.body.name,
            description: req.body.description,
            cuisine: req.body.cuisine,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            openingHours: req.body.openingHours,
            averageCost: req.body.averageCost,
            tags: req.body.tags,
            tips: req.body.tips,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ownerID: ownerId,
                ownerEmail: owner.email,
            },
        };

        // Add new restaurant to Firestore
        const addedRestaurant = await db.collection("restaurants").add(newRestaurant);

        logger.info(`New restaurant added with ID: ${addedRestaurant.id}`);
        res.status(201).json({ message: "Restaurant added successfully", id: addedRestaurant.id });
    } catch (error) {
        logger.error("Error adding new restaurant:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const userId = req.user.id;
        logger.info(`Deleting restaurant with ID: ${restaurantId}`);

        // Fetch the restaurant document by ID
        const restaurantRef = db.collection("restaurants").doc(restaurantId);
        const querySnapshot = await restaurantRef.get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Restaurant with ID ${restaurantId} not found.`);
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Double check if the user is the owner of the restaurant
        const restaurantData = querySnapshot.data();
        if (restaurantData.metadata.ownerID !== userId) {
            logger.warn(`User ${userId} is not authorized to delete restaurant with ID: ${restaurantId}`);
            return res.status(403).json({ message: "Forbidden: You are not the owner of this restaurant" });
        }

        // Delete the restaurant document
        await restaurantRef.delete();

        logger.info(`Restaurant with ID ${restaurantId} deleted successfully.`);
        res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting restaurant with ID ${req.params.restaurantId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const { ownerId, ...updatedData } = req.body;
        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to update restaurant for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        logger.info(`Updating restaurant with ID: ${restaurantId}`);

        // Fetch the restaurant document by ID
        const restaurantRef = db.collection("restaurants").doc(restaurantId);
        const querySnapshot = await restaurantRef.get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Restaurant with ID ${restaurantId} not found.`);
            return res.status(404).json({ message: "Restaurant not found" });
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

        // Update the restaurant document
        await restaurantRef.update(updatedData);

        logger.info(`Restaurant with ID ${restaurantId} updated successfully.`);
        res.status(200).json({ message: "Restaurant updated successfully" });
    } catch (error) {
        logger.error(`Error updating restaurant with ID ${req.params.restaurantId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { generateRestaurants, getRestaurants, getRestaurant, createRestaurant, deleteRestaurant, updateRestaurant };
