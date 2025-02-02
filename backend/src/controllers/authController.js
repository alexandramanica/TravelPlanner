const logger = require("../config/logger.js");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        logger.info(`Registering user with email: ${email}`);

        // Check if the user already exists
        const usersRef = db.collection("users");
        const userSnapshot = await usersRef.where("email", "==", email).get();

        if (!userSnapshot.empty) {
            logger.warn(`Registration failed: User with email ${email} already exists!`);
            return res.status(400).json({ 
                message: `User with email ${email} already exists` 
            });
        }

        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        logger.info(`Password hashed successfully for email: ${email}`);

        // Create a new user object
        const user = {
            email,
            firstName,
            lastName,
            password: hashedPassword,
        };

        // Save the user to Firestore
        await usersRef.add(user);
        logger.info(`User registered successfully with email: ${email}`);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        logger.error(`Error registering user with email ${req.body.email}: ${error.message}`, { error });
        res.status(500).json({ 
            message: "Server error. Please try again later.", 
            error: error.message 
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        logger.info(`Attempting login for email: ${email}`);

        // Find user by email
        const usersRef = db.collection("users");
        const userSnapshot = await usersRef.where("email", "==", email).get();

        if (userSnapshot.empty) {
            logger.warn(`Login failed: No account found for email ${email}`);
            return res.status(400).json({
                message: "No account registered with the provided email!",
            });
        }

        // Check password and generate JWT token
        const userDoc = userSnapshot.docs[0]; //Email is unique
        const userData = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            logger.warn(`Login failed: Invalid credentials for email ${email}`);
            return res.status(400).json({ message: `Invalid credentials for email ${email}!` });
        }

        // Generate JWT token
        const secret = process.env.SECRET_KEY;
        const jwtToken = jwt.sign(
            {
                id: userDoc.id,
                email: userData.email
            },
            secret,
            { expiresIn: "3h" }
        );


        logger.info(`User logged in successfully with email: ${email}`);
        res.status(200).json({
            userId: userDoc.id,
            token: jwtToken,
            message: "Login successful",
        });
    } catch (error) {
        logger.error(`Error logging in user with email ${req.body.email}: ${error.message}`, { error });
        res.status(500).json({ message: "Server error" });
    }
};

const logoutUser = async (req, res) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            logger.warn("Logout failed: No token provided");
            return res.status(400).json({ message: "No token provided for logout" });
        }

        logger.info("User logged out successfully");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        logger.error("Error logging out user:", { error: error.message });
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { registerUser, loginUser, logoutUser };
