const db = require("../config/db.js");
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const logger = require("../config/logger.js"); 

const generateUsers = async (req, res) => {
    try {
        const saltRounds = 10;

        logger.info("Starting user generation process...");

        // Generate 5 users
        for (let i = 0; i < 5; i++) {
            let firstName = faker.person.firstName();
            let lastName = faker.person.lastName();
            let email = faker.internet.email(firstName, lastName);
            let passw = faker.internet.password();
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassw = await bcrypt.hash(passw, salt);

            const user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassw,
            };

            // Add user to Firestore
            await db.collection("users").add(user);
            logger.info(`Generated user: ${email} and ${passw}`);
        }

        logger.info("User generation process completed successfully.");
        res.status(201).json({ message: "Users added" });
    } catch (error) {
        logger.error("Error generating users:", { error: error.message });
        res.status(500).json({
            message: "Server error",
        });
    }
};

const getUsers = async (req, res) => {
    try {
        logger.info("Fetching all users from the database...");

        // Fetch all users from the 'users' collection
        const querySnapshot = await db.collection("users").get();

        // Check if the collection is empty
        if (querySnapshot.empty) {
            logger.warn("No users found in the database.");
            return res.status(404).json({ message: "No users found" });
        }

        // Map querySnapshot to an array of user objects
        const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${users.length} users successfully.`);
        res.status(200).json({ users });
    } catch (error) {
        logger.error("Error fetching users:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        logger.info(`Fetching user with ID: ${userId}`);

        // Fetch the user document by ID
        const querySnapshot = await db.collection("users").doc(userId).get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`User with ID ${userId} not found.`);
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare the user object
        const user = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
        };

        logger.info(`User with ID ${userId} fetched successfully.`);
        res.status(200).json({ user });
    } catch (error) {
        logger.error(`Error fetching user with ID ${req.params.userId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { generateUsers, getUsers, getUser };
