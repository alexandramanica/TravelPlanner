<template>
  <div class="activities-container bg-light py-4">
    <NavbarMenuForm />
    <div class="container">
      <h1 class="page-title display-4 mb-4">My Activities</h1>
      <h2 class="page-subtitle mb-4">
        Discover, plan, and organize your activities. From thrilling adventures to relaxing workshops, find your next great experience.
      </h2>

      <!-- Filter Toggle -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-outline-primary" @click="toggleFilter">
          <i class="bi" :class="filterMyActivities ? 'bi-person-check' : 'bi-list'"></i>
          {{ filterMyActivities ? 'Show All' : 'Show My Activities' }}
        </button>
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus-circle"></i> Add Activity
        </button>
      </div>

      <div class="row g-4">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100 border-0 shadow-sm activity-card">
            <div
              class="type-strip"
              :class="getCategoryColor(activity.category)"
            ></div>
            <div class="card-body position-relative">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h3 class="card-title mb-0">
                  <i class="bi bi-calendar-event me-2"></i>
                  {{ activity.name || 'Unnamed Activity' }}
                </h3>

                <div v-if="activity.metadata.ownerID === currentUserId">
                  <button
                    class="btn btn-sm btn-outline-warning me-2"
                    @click="openEditModal(activity)"
                  >
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteActivity(activity.id)"
                  >
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>

              <p class="text-muted mb-3">
                <i class="bi bi-geo-fill me-2"></i>
                {{ activity.city || 'Unknown City' }}, {{ activity.country || 'Unknown Country' }}
              </p>

              <p class="card-text mb-3">
                <i class="bi bi-info-circle me-2"></i>
                {{ activity.description || 'No description available.' }}
              </p>

              <p class="card-text mb-3">
                <i class="bi bi-clock me-2"></i>
                {{ activity.duration || 'N/A' }}
              </p>

              <p class="card-text mb-3">
                <i class="bi bi-cash-coin me-2"></i>
                ${{ activity.price || 0 }}
              </p>

              <div class="button-group">
                <button
                  class="btn btn-outline-primary me-2 w-100 mb-2"
                  @click="openModal(activity)"
                >
                  <i class="bi bi-book me-2"></i> Read More
                </button>
                <button
                  class="btn btn-primary w-100"
                  @click="openTripSelectionModal(activity)"
                >
                  <i class="bi bi-suitcase me-2"></i> Add to My Trips
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ActivityModal
      v-if="showModal"
      :isOpen="showModal"
      :activity="selectedActivity"
      @close="showModal = false"
    />

    <AddEditActivityModal
      v-if="showAddEditModal"
      :isOpen="showAddEditModal"
      :editMode="editMode"
      :activity="currentActivity"
      @close="closeAddEditModal"
      @save="saveActivity"
    />

    <TripSelectionModal
      v-if="showTripModal"
      :isOpen="showTripModal"
      :trips="userTrips"
      itemType="activity"
      :error="error"
      :showAlert="showAlert"
      @close="closeTripModal"
      @confirm="addActivityToTrip"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import NavbarMenuForm from "../components/NavbarMenuForm.vue";
import ActivityModal from "../components/Modals/ActivityModal.vue";
import AddEditActivityModal from "../components/Modals/AddEditActivityModal.vue";
import TripSelectionModal from "../components/Modals/TripSelectionModal.vue";

export default {
  name: "ActivitiesView",
  components: {
    NavbarMenuForm,
    ActivityModal,
    AddEditActivityModal,
    TripSelectionModal,
  },
  setup() {
    const store = useStore();
    const activities = ref([]);
    const userTrips = ref([]);
    const filterMyActivities = ref(false);

    const editMode = ref(false);
    const currentUserId = store.state.userId;

    const selectedActivity = ref(null);
    const currentActivity = ref(null);

    const showModal = ref(false);
    const showAddEditModal = ref(false);
    const showTripModal = ref(false);

    const error = ref(""); 
    const showAlert = ref(false); 

    const getCategoryColor = (category) => {
      const colors = {
        Outdoor: "type-outdoor",
        Indoor: "type-indoor",
        Sports: "type-sports",
        Workshop: "type-workshop",
        Other: "type-default",
      };
      return colors[category] || "type-default";
    };

    const fetchActivities = async () => {
      try {
        const token = store.state.token;
        const response = await axios.get(
          "http://localhost:8001/api/activity/get-all-activities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        activities.value = response.data.activities.map((activity) => ({
          id: activity.id ,
          name: activity.name || "Unnamed Activity",
          description: activity.description || "No description available.",
          category: activity.category || "Other",
          country: activity.country || "Unknown",
          city: activity.city || "Unknown",
          address: activity.address || "Unknown",
          duration: activity.duration || "N/A",
          price: activity.price || 0,
          tags: activity.tags || [],
          tips: activity.tips || "",
          metadata: activity.metadata || {},
        }));

      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    const fetchTrips = async () => {
      try {
        const token = store.state.token;
        const userId = store.state.userId;

        const response = await axios.get(
          `http://localhost:8001/api/trip/get-user-trips/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        userTrips.value = response.data.trips.map((trip) => ({
          id: trip.id,
          name: trip.name,
        }));
      } catch (error) {
        console.error("Error fetching user trips:", error);
      }
    };

    const deleteActivity = async (id) => {
      try {
        const token = store.state.token;
        await axios.delete(
          `http://localhost:8001/api/activity/delete-activity/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        activities.value = activities.value.filter((activity) => activity.id !== id);
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    };

    const saveActivity = async (activity) => {
      try {
        const token = store.state.token;
        let response;

        if (editMode.value) {
          response = await axios.put(
            `http://localhost:8001/api/activity/update-activity/${activity.id}`,
            activity,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const updatedActivity = response.data.activity;
          const index = activities.value.findIndex((act) => act.id === updatedActivity.id);
          if (index !== -1) {
            activities.value[index] = { ...activities.value[index], ...updatedActivity };
            activities.value = [...activities.value];
          }
        } else {
          response = await axios.post(
            "http://localhost:8001/api/activity/create-activity",
            activity,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          activities.value.push(response.data.activity);
        }

        await fetchActivities();

        showAddEditModal.value = false;
        
      } catch (error) {
        console.error("Error saving activity:", error);
      }
    };

    const addActivityToTrip = async (tripId) => {
      try {
        
        console.log("Adding activity to trip:", selectedActivity.value, tripId);

        if (!selectedActivity.value || !selectedActivity.value.id) {
          console.error("No activity selected or activity ID is missing.");
        }

        const token = store.state.token;
        const activityId = selectedActivity.value.id; // Define activityId here

        await axios.put(
          `http://localhost:8001/api/trip/${tripId}/add-activity`,
          { activityId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`Activity ${activityId} added to trip ${tripId}`);
        closeTripModal();
      } catch (err) {
        console.error("Error adding activity to trip:", err);

        const message = err.response?.data?.message || "An error occurred. Please try again later.";
        error.value = message;

        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 5000);
      }
    };

    const toggleFilter = () => {
      filterMyActivities.value = !filterMyActivities.value;
    };

    const filteredActivities = computed(() => {
      return activities.value
        .filter((activity) => activity && activity.id) 
        .filter((activity) => {
          if (filterMyActivities.value) {
            return activity.metadata?.ownerID === currentUserId;
          }
          return true;
        });
    });

    const openModal = (activity) => {
      selectedActivity.value = activity;
      showModal.value = true;
    };

    const openAddModal = () => {
      currentActivity.value = null;
      editMode.value = false;
      showAddEditModal.value = true;
    };

    const openEditModal = (activity) => {
      currentActivity.value = activity;
      editMode.value = true;
      showAddEditModal.value = true;
    };

    const openTripSelectionModal = (activity) => {
      selectedActivity.value = activity;
      showTripModal.value = true;
      fetchTrips();
    };

    const closeAddEditModal = () => {
      showAddEditModal.value = false;
      currentActivity.value = null;
    };

    const closeTripModal = () => {
      showTripModal.value = false;
      selectedActivity.value = null;
    };

    onMounted(() => {
      fetchActivities();
    });

    return {
      activities,
      userTrips,
      filterMyActivities,
      filteredActivities,

      currentUserId,
      editMode,

      selectedActivity,
      currentActivity,

      showModal,
      showAddEditModal,
      showTripModal,

      openModal,
      openAddModal,
      openEditModal,
      openTripSelectionModal,

      closeAddEditModal,
      closeTripModal,

      saveActivity,
      deleteActivity,
      addActivityToTrip,

      getCategoryColor,
      toggleFilter,

      error,
      showAlert
    };
  },
};
</script>

<style scoped>
.activities-container {
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

.activity-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  overflow: hidden;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.type-strip {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.2s ease-in-out;
}

.activity-card:hover .type-strip {
  width: 8px;
}

/* Type colors */
.type-outdoor {
  background: linear-gradient(to bottom, #d2fed3, #5b8d22);
}

.type-indoor {
  background: linear-gradient(to bottom, #ffc8dd, #e63946);
}

.type-sports {
  background: linear-gradient(to bottom, #ade8f4, #023e8a);
}

.type-workshop {
  background: linear-gradient(to bottom, #fff7ac, #ffc107);
}

.type-default {
  background: linear-gradient(to bottom, #e0e0e0, #9e9e9e);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2A0052;
}

.details-section {
  font-size: 0.9rem;
}

.button-group {
  margin-top: auto;
}

/* Custom hover effects for buttons */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn-outline-primary {
  border-color: #2A0052;
  color: #2A0052;
}

.btn-outline-primary:hover {
  transform: scale(1.02);
  background-color: #2A0052;
  border-color: #2A0052;
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

/* Filter button styling */
.btn-outline-primary {
  border: 1px solid #2A0052;
  background-color: transparent;
  color: #2A0052;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #2A0052;
  color: #fff;
}

.btn-outline-primary i {
  margin-right: 0.5rem;
}

/* Styling for Edit and Delete buttons */
.btn-outline-warning {
  border-color: #ffc107;
  color: #ffc107;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  color: white;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-title {
    font-size: 1.1rem;
  }

  .details-section {
    font-size: 0.85rem;
  }

  .btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
  }

  .btn-outline-warning,
  .btn-outline-danger {
    font-size: 0.85rem;
    padding: 0.3rem 0.5rem;
  }

  .btn-outline-primary {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
