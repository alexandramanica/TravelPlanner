<template>
    <div class="trips-container bg-light py-4">
      <NavbarMenuForm />
      <div class="container">
        <h1 class="page-title display-4 mb-4">My Trips</h1>
        <h2 class="page-subtitle mb-4">
          Keep track of your trips, activities, restaurants, and attractions all in one place.
        </h2>
        
        <div class="d-flex justify-content-between align-items-left mb-3 mt-2">
          <button class="btn btn-primary" @click="openAddModal">
            <i class="bi bi-plus-circle"></i> Add Trip
          </button>
        </div>
  
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <div class="col">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body">
                <h5 class="card-title">Attractions</h5>
                <p class="display-4 fw-bold mb-0">{{ attractionCount }}</p>
                <p class="text-muted">Your favorite attractions are ready to explore.</p>
              </div>
            </div>
          </div>
  
          <div class="col">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body">
                <h5 class="card-title">Activities</h5>
                <p class="display-4 fw-bold mb-0">{{ activityCount }}</p>
                <p class="text-muted">Exciting activities are waiting for you.</p>
              </div>
            </div>
          </div>
  
          <div class="col">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body">
                <h5 class="card-title">Restaurants</h5>
                <p class="display-4 fw-bold mb-0">{{ restaurantCount }}</p>
                <p class="text-muted">Discover the best culinary experiences.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-3">
            <div v-if="trips && trips.length === 0" class="text-center">
                <p>No trips available. Start planning your next adventure!</p>
            </div>
            <div v-for="trip in trips" :key="trip.id" class="col">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                    <h5 class="card-title">
                      <i class="bi bi-suitcase me-2"></i>
                      {{ trip.name }}
                    </h5>
                    <p class="card-text text-muted mb-2">{{ trip.description || 'No description available.' }}</p>
                   
                    <p class="card-text text-muted">
                        <i class="bi bi-calendar"></i> Start Date: {{ trip.startDate || 'N/A' }}
                    </p>
                    <p class="card-text text-muted">
                        <i class="bi bi-calendar-check"></i> End Date: {{ trip.endDate || 'N/A' }}
                    </p>
                    <div class="button-group">
                      <button
                          class="btn btn-primary me-2 w-100 mb-2"
                          @click="openModal(trip)"
                        >
                          <i class="bi bi-eye me-2"></i> Read More
                        </button>
                        <button
                          class="btn btn-outline-warning me-2 w-100 mb-2"
                          @click="openEditModal(trip)"
                        >
                          <i class="bi bi-pencil me-2"></i> Edit Trip
                        </button>
                        <button
                          class="btn btn-outline-danger me-2 w-100"
                          @click="deleteTrip(trip.id)"
                        >
                          <i class="bi bi-trash me-2"></i> Delete trip
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      <TripModal
        v-if="showModal"
        :isOpen="showModal"
        :trip="selectedTrip"
        :fetchTrips="fetchTrips"
        @close="showModal = false"
      />

      <AddEditTripModal
        v-if="showAddEditModal"
        :isOpen="showAddEditModal"
        :editMode="editMode"
        :trip="currentTrip"
        @close="closeAddEditModal"
        @save="saveTrip"
      />

    </div>
  </template>
  
<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import NavbarMenuForm from "../components/NavbarMenuForm.vue";
import TripModal from "@/components/Modals/TripModal.vue";
import AddEditTripModal from "@/components/Modals/AddEditTripModal.vue";

export default {
  name: "TripsView",
  components: {
    NavbarMenuForm,
    TripModal,
    AddEditTripModal
  },
  setup() {
    const store = useStore();

    const restaurantCount = ref(0);
    const activityCount = ref(0);
    const attractionCount = ref(0);
    const trips = ref([]);

    const editMode = ref(false);
    const currentUserId = store.state.userId;

    const selectedTrip = ref({});
    const currentTrip = ref({});

    const showModal = ref(false);
    const showAddEditModal = ref(false);

    const fetchRestaurantCount = async () => {
      try {
        const token = store.state.token;

        const response = await axios.get("http://localhost:8001/api/restaurant/get-restaurant-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        restaurantCount.value = response.data.count || 0;
      } catch (error) {
        console.error("Error fetching trip count:", error);
      }
    };

    const fetchActivityCount = async () => {
      try {
        const token = store.state.token;

        const response = await axios.get("http://localhost:8001/api/activity/get-activity-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        activityCount.value = response.data.count || 0;
      } catch (error) {
        console.error("Error fetching trip count:", error);
      }
    };

    const fetchAttractionCount = async () => {
      try {
        const token = store.state.token;

        const response = await axios.get("http://localhost:8001/api/attraction/get-attraction-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        attractionCount.value = response.data.count || 0;
      } catch (error) {
        console.error("Error fetching trip count:", error);
      }
    };

    const fetchTrips = async () => {
      try {
        const token = store.state.token;
        const response = await axios.get("http://localhost:8001/api/trip/get-all-trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response.data.trips);
        trips.value = response.data.trips.map((trip) => ({
          id: trip.id,
          name: trip.name || "Unknown",
          budget: trip.budget || "Unknown",
          description: trip.description || "No description available.",
          startDate: trip.startDate || "N/A",
          endDate: trip.endDate || "N/A",
          attractionsSnapshot: trip.attractionsSnapshot || [],
          restaurantsSnapshot: trip.restaurantsSnapshot || [],
          activitiesSnapshot: trip.activitiesSnapshot || [],
          metadata: trip.metadata || {},
        }));
        console.log("Trips:", trips.value);

      
        if (selectedTrip.value && selectedTrip.value.id) {
          selectedTrip.value = trips.value.find(trip => trip.id === selectedTrip.value.id) || {};
        }

    console.log("Updated trips fetched and selectedTrip reassigned:", selectedTrip.value);

      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    const deleteTrip = async (id) => {
        try {
          const token = store.state.token;
          await axios.delete(`http://localhost:8001/api/trip/delete-trip/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          trips.value = trips.value.filter((trip) => trip.id !== id);
        } catch (error) {
          console.error("Error deleting trip:", error);
        }
      };
  
      const saveTrip = async (trip) => {
        try {
          const token = store.state.token;
          let response;
  
          if (editMode.value) {
            response = await axios.put(
              `http://localhost:8001/api/trip/update-trip/${trip.id}`,
              trip,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            const updatedTrip = response.data.trip;
            const index = trips.value.findIndex((trip) => trip.id === updatedTrip.id);
            if (index !== -1) {
              trips.value[index] = { ...trips.value[index], ...updatedTrip };
              trips.value = [...trips.value];
            }
          } else {
            response = await axios.post(
              "http://localhost:8001/api/trip/create-trip",
              trip,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            const newTrip = response.data.trip;
            if (newTrip && newTrip.id) {
              trips.value.push(newTrip);
              trips.value = [...trips.value];
            }
          }
  
          await fetchTrips();
          showAddEditModal.value = false;

        } catch (error) {
          console.error("Error saving trips:", error);
        }
      };

    const openModal = (trip) => {
      selectedTrip.value = trip;
      showModal.value = true;
    };

    const openAddModal = () => {
        currentTrip.value = null;
        editMode.value = false;
        showAddEditModal.value = true;
    };
    
    const openEditModal = (trip) => {
        currentTrip.value = trip;
        editMode.value = true;
        showAddEditModal.value = true;
      };

    const closeAddEditModal = () => {
        showAddEditModal.value = false;
        currentTrip.value = null;
      };

    onMounted(() => {
        fetchRestaurantCount();
        fetchActivityCount();
        fetchAttractionCount();
        fetchTrips();
    });

    return {
        restaurantCount,
        activityCount,
        attractionCount,

        trips,
        selectedTrip,
        currentTrip,

        currentUserId,
        editMode,

        showModal,
        showAddEditModal,

        openModal,
        openAddModal,
        openEditModal,
        closeAddEditModal,

        fetchTrips,
        saveTrip,
        deleteTrip
    };
  },
};
</script>
  
  <style scoped>
  .trips-container {
    min-height: 100vh;
  }
  
  .container .page-title {
    font-weight: 700;
    color: #853acb;
    font-size: 2.5rem;
    text-align: left;
    text-decoration: underline;
  }
  
  .container .page-subtitle {
    font-size: 1.25rem;
    color: #2A0052;
    text-align: left;
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2A0052;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .display-4 {
    color: #853acb;
  }

.btn {
    transition: all 0.2s ease-in-out;
}

.btn-primary {
  background-color: #2A0052;
  border-color: #2A0052;
}

.btn-primary:hover {
  transform: scale(1.02);
  background-color: #BC87E8;
  border-color: #BC87E8;
}
  </style>
  