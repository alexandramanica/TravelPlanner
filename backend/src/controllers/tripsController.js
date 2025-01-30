const db = require("../config/db.js");
const logger = require("../config/logger.js");
const { fetchUserById } = require("../controllers/userController.js");

const getTrips = async (req, res) => {
    try {
        logger.info("Fetching all trips...");

        // Fetch all trips from the 'trips' collection
        const querySnapshot = await db.collection("trips").get();

        // Check if the collection is empty
        if (querySnapshot.empty) {
            logger.warn("No trips found.");
            return res.status(404).json({ message: "No trips found" });
        }

        // Map querySnapshot to an array of trips objects
        const trips = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${trips.length} trips successfully.`);
        res.status(200).json({ trips });
    } catch (error) {
        logger.error("Error fetching trips:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTrip = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        logger.info(`Fetching trip with ID: ${tripId}`);

        // Fetch the trip document by ID
        const querySnapshot = await db.collection("trips").doc(tripId).get();

        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Prepare the trip object
        const trip = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
        };

        logger.info(`Trip with ID ${tripId} fetched successfully.`);
        res.status(200).json({ trip });
    } catch (error) {
        logger.error(`Error fetching trip with ID ${req.params.tripId}:`, { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTripCount = async (req, res) => {
    try {
        logger.info("Fetching the total count of trips...");

        // Fetch all trips from the 'trips' collection
        const querySnapshot = await db.collection("trips").get();

        // Getting the count of trips
        const tripCount = querySnapshot.size;

        logger.info(`Total number of trips: ${tripCount}`);
        res.status(200).json({ count: tripCount });
    } catch (error) {
        logger.error("Error fetching the trip count:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createTrip = async (req, res) => {
    try {
        logger.info("Creating a new trip...");

        // Extract trip details 
        const { name, budget, startDate, endDate, description, ownerId = null } = req.body;

        // Validate user authorization
        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Unauthorized attempt by user ${req.user.id} to create a trip for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        // Validate the owner
        const owner = await fetchUserById(ownerId);
        if (!owner) {
            logger.warn(`Owner with ID ${ownerId} not found.`);
            return res.status(404).json({ message: "Owner not found" });
        }

        //Ttrip object with empty snapshots
        const newTrip = {
            name,
            budget,
            startDate,
            endDate,
            description,
            attractionsSnapshot: [], 
            restaurantsSnapshot: [], 
            activitiesSnapshot: [], 
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ownerID: ownerId,
                ownerEmail: owner.email,
            },
        };

        // Add the trip to Firestore
        const addedTrip = await db.collection("trips").add(newTrip);

        logger.info(`New trip created with ID: ${addedTrip.id}`);
        res.status(201).json({ message: "Trip created successfully", id: addedTrip.id });
    } catch (error) {
        logger.error("Error creating trip:", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const userId = req.user.id;
        logger.info(`Deleting trip with ID: ${tripId}`);

        const tripRef = db.collection("trips").doc(tripId);
        const querySnapshot = await tripRef.get();

        if (!querySnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Double check if the user is the owner of the trip
        const tripData = querySnapshot.data();
        if (tripData.metadata.ownerID !== userId) {
            logger.warn(`User ${userId} is not authorized to delete restaurant with ID: ${tripId}`);
            return res.status(403).json({ message: "Forbidden: You are not the owner of this restaurant" });
        }

        await tripRef.delete();

        logger.info(`Trip with ID ${tripId} deleted successfully.`);
        res.status(200).json({ message: "Trip deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting trip with ID ${req.params.tripId}:`, { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTrip = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const { ...updatedData } = req.body;
        const ownerId = updatedData.metadata.ownerID;
    
        if (ownerId && ownerId !== req.user.id) {
            logger.warn(`Owner ID mismatch: User ${req.user.id} attempted to update trip for Owner ID ${ownerId}`);
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    
        logger.info(`Updating trip with ID: ${tripId}`);
    
        const tripRef = db.collection("trips").doc(tripId);
        const querySnapshot = await tripRef.get();
    
        // Check if the document exists
        if (!querySnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
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
    
        // Update the trip document
        await tripRef.update(updatedData);
    
        logger.info(`Trip with ID ${tripId} updated successfully.`);
        res.status(200).json({
            message: "Trip updated successfully",
            trip: { ...updatedData },
        });
    } catch (error) {
        logger.error(`Error updating trip with ID ${req.params.tripId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Controller to add an attraction to a trip
const addAttractionToTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { attractionId } = req.body;

        logger.info(`Adding attraction with ID: ${attractionId} to trip with ID: ${tripId}`);

        // Validate the trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnapshot = await tripRef.get();

        if (!tripSnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Validate the attraction exists
        const attractionRef = db.collection("attractions").doc(attractionId);
        const attractionSnapshot = await attractionRef.get();

        if (!attractionSnapshot.exists) {
            logger.warn(`Attraction with ID ${attractionId} not found.`);
            return res.status(404).json({ message: "Attraction not found" });
        }

        // Add attraction to the trips attractionsSnapshot
        const tripData = tripSnapshot.data();
        const updatedAttractions = tripData.attractionsSnapshot || [];
        const alreadyExists = updatedAttractions.some((attraction) => attraction.id === attractionId);

        if (alreadyExists) {
            logger.warn(`Attraction with ID ${attractionId} already exists in trip with ID ${tripId}.`);
            return res.status(400).json({ message: "Attraction already exists in the trip" });
        }

        updatedAttractions.push({
            id: attractionId,
            name: attractionSnapshot.data().name,
            description: attractionSnapshot.data().description,
            entryFee: attractionSnapshot.data().entryFee,
        });

        await tripRef.update({ attractionsSnapshot: updatedAttractions });

        logger.info(`Attraction with ID ${attractionId} added to trip with ID ${tripId}`);
        res.status(200).json({ message: "Attraction added to trip successfully" });
    } catch (error) {
        logger.error(`Error adding attraction to trip: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Controller to delet an attraction from a trip
const deleteAttractionFromTrip = async (req, res) => {
    try {
        const { tripId, attractionId } = req.params;

        logger.info(`Deleting attraction with ID: ${attractionId} from trip with ID: ${tripId}`);

        // Validate the trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnapshot = await tripRef.get();

        if (!tripSnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if the attraction exists in the trip's attractionsSnapshot
        const tripData = tripSnapshot.data();
        const updatedAttractions = tripData.attractionsSnapshot || [];
        const attractionIndex = updatedAttractions.findIndex((attraction) => attraction.id === attractionId);

        if (attractionIndex === -1) {
            logger.warn(`Attraction with ID ${attractionId} does not exist in trip with ID ${tripId}.`);
            return res.status(404).json({ message: "Attraction not found in this trip" });
        }

        // Remove the attraction from the snapshot
        updatedAttractions.splice(attractionIndex, 1);

        await tripRef.update({ attractionsSnapshot: updatedAttractions });

        logger.info(`Attraction with ID ${attractionId} removed from trip with ID ${tripId}`);
        res.status(200).json({ message: "Attraction removed from trip successfully" });
    } catch (error) {
        logger.error(`Error removing attraction from trip: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Controller to add an restaurant to a trip
const addRestaurantToTrip = async (req, res) => {
    try {
        const { tripId } = req.params; // Extract trip ID from URL
        const { restaurantId } = req.body; // Extract restaurant ID from body

        logger.info(`Adding restaurant with ID: ${restaurantId} to trip with ID: ${tripId}`);

        // Validate the trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnapshot = await tripRef.get();

        if (!tripSnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Validate the restaurant exists
        const restaurantRef = db.collection("restaurants").doc(restaurantId);
        const restaurantSnapshot = await restaurantRef.get();

        if (!restaurantSnapshot.exists) {
            logger.warn(`Restaurant with ID ${restaurantId} not found.`);
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Add restaurant to the trips restaurantsSnapshot
        const tripData = tripSnapshot.data();
        const updatedRestaurants = tripData.restaurantsSnapshot || [];
        const alreadyExists = updatedRestaurants.some((restaurant) => restaurant.id === restaurantId);

        if (alreadyExists) {
            logger.warn(`Restaurant with ID ${restaurantId} already exists in trip with ID ${tripId}.`);
            return res.status(400).json({ message: "Restaurant already exists in the trip" });
        }

        updatedRestaurants.push({
            id: restaurantId,
            name: restaurantSnapshot.data().name, 
            description: restaurantSnapshot.data().description,
            averageCost: restaurantSnapshot.data().averageCost,
        });

        await tripRef.update({ restaurantsSnapshot: updatedRestaurants });

        logger.info(`Restaurant with ID ${restaurantId} added to trip with ID ${tripId}`);
        res.status(200).json({ message: "Restaurant added to trip successfully" });
    } catch (error) {
        logger.error(`Error adding restaurant to trip: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Controller to delet a restaurant from a trip
const deleteRestaurantFromTrip = async (req, res) => {
    try {
        
        const { tripId, restaurantId } = req.params;

        logger.info(`Deleting restaurant with ID: ${restaurantId} from trip with ID: ${tripId}`);

        // Validate the trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnapshot = await tripRef.get();

        if (!tripSnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if the restaurant exists in the trip's restaurantsSnapshot
        const tripData = tripSnapshot.data();
        const updatedRestaurants = tripData.restaurantsSnapshot || [];
        const restaurantIndex = updatedRestaurants.findIndex((restaurant) => restaurant.id === restaurantId);

        if (restaurantIndex === -1) {
            logger.warn(`Restaurant with ID ${restaurantId} does not exist in trip with ID ${tripId}.`);
            return res.status(404).json({ message: "Restaurant not found in this trip" });
        }

        // Remove the restaurant from the snapshot
        updatedRestaurants.splice(restaurantIndex, 1);

        await tripRef.update({ restaurantsSnapshot: updatedRestaurants });

        logger.info(`Restaurant with ID ${restaurantId} removed from trip with ID ${tripId}`);
        res.status(200).json({ message: "Restaurant removed from trip successfully" });
    } catch (error) {
        logger.error(`Error removing restaurant from trip: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Controller to add an activity to a trip
const addActivityToTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { activityId } = req.body;

        logger.info(`Adding activity with ID: ${activityId} to trip with ID: ${tripId}`);

        // Validate the trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnapshot = await tripRef.get();

        if (!tripSnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Validate the activity exists
        const activityRef = db.collection("activities").doc(activityId);
        const activitySnapshot = await activityRef.get();

        if (!activitySnapshot.exists) {
            logger.warn(`Activity with ID ${activityId} not found.`);
            return res.status(404).json({ message: "Activity not found" });
        }

        // Add activity to the trips activitiesSnapshot
        const tripData = tripSnapshot.data();
        const updatedActivities = tripData.activitiesSnapshot || [];
        const alreadyExists = updatedActivities.some((activity) => activity.id === activityId);

        if (alreadyExists) {
            logger.warn(`Activity with ID ${activityId} already exists in trip with ID ${tripId}.`);
            return res.status(400).json({ message: "Activity already exists in the trip" });
        }

        updatedActivities.push({
            id: activityId,
            name: activitySnapshot.data().name,
            description: activitySnapshot.data().description,
            price: activitySnapshot.data().price,
        });

        await tripRef.update({ activitiesSnapshot: updatedActivities });

        logger.info(`Activity with ID ${activityId} added to trip with ID ${tripId}`);
        res.status(200).json({ message: "Activity added to trip successfully" });
    } catch (error) {
        logger.error(`Error adding activity to trip: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Controller to delete an activity from a trip
const deleteActivityFromTrip = async (req, res) => {
    try {
        
        const { tripId, activityId } = req.params;

        logger.info(`Deleting activity with ID: ${activityId} from trip with ID: ${tripId}`);

        // Validate the trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripSnapshot = await tripRef.get();

        if (!tripSnapshot.exists) {
            logger.warn(`Trip with ID ${tripId} not found.`);
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if the activity exists in the trip's activitiesSnapshot
        const tripData = tripSnapshot.data();
        const updatedActivities = tripData.activitiesSnapshot || [];
        const activityIndex = updatedActivities.findIndex((activity) => activity.id === activityId);

        if (activityIndex === -1) {
            logger.warn(`Activity with ID ${activityId} does not exist in trip with ID ${tripId}.`);
            return res.status(404).json({ message: "Activity not found in this trip" });
        }

        // Remove the activity from the snapshot
        updatedActivities.splice(activityIndex, 1);

        await tripRef.update({ activitiesSnapshot: updatedActivities });

        logger.info(`Activity with ID ${activityId} removed from trip with ID ${tripId}`);
        res.status(200).json({ message: "Activity removed from trip successfully" });
    } catch (error) {
        logger.error(`Error removing activity from trip: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserTrips = async (req, res) => {
    try {
        const userId = req.params.userId; // Extract userId from route parameter
        logger.info(`Fetching trips for user with ID: ${userId}`);

        // Query the database for trips where metadata.ownerID matches userId
        const querySnapshot = await db.collection("trips")
            .where("metadata.ownerID", "==", userId)
            .get();

        // Check if any trips were found
        if (querySnapshot.empty) {
            logger.warn(`No trips found for user with ID: ${userId}`);
            return res.status(404).json({ message: "No trips found for this user" });
        }

        // Map the results to an array of trip objects
        const trips = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`Fetched ${trips.length} trips for user with ID: ${userId}`);
        res.status(200).json({ trips });
    } catch (error) {
        logger.error(`Error fetching trips for user with ID: ${req.params.userId}:`, {
            error: error.message,
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {getTrips, getTrip, getTripCount, 
    createTrip, deleteTrip, updateTrip,
    addAttractionToTrip, deleteAttractionFromTrip, 
    addRestaurantToTrip, deleteRestaurantFromTrip, 
    addActivityToTrip, deleteActivityFromTrip, 
    getUserTrips};
