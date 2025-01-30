<template>
  <div class="attractions-container bg-light py-4">
    <NavbarMenuForm />
    <div class="container">
      <h1 class="page-title display-4 mb-4">Popular Attractions</h1>
      <h2 class="page-subtitle mb-4">
        Explore the most popular attractions around the world. From
        breathtaking natural wonders and iconic landmarks to vibrant cultural
        hotspots and hidden gems, your journey awaits.
      </h2>

      <!-- Filter Toggle -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-outline-primary" @click="toggleFilter">
          <i class="bi" :class="filterMyAttractions ? 'bi-person-check' : 'bi-list'"></i>
          {{ filterMyAttractions ? 'Show All' : 'Show My Attractions' }}
        </button>
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus-circle"></i> Add Attraction
        </button>
      </div>

      <div class="row g-4">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100 border-0 shadow-sm attraction-card">
            <div
              class="type-strip"
              :class="gettypeColor(card.type)"
            ></div>
            <div class="card-body position-relative">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h3 class="card-title mb-0">
                  <i class="bi bi-geo-alt me-2"></i>
                  {{ card.name }}
                </h3>

                <!-- Conditionally Render Edit and Delete Buttons -->
                <div v-if="card.metadata.ownerID === currentUserId">
                  <button
                    class="btn btn-sm btn-outline-warning me-2"
                    @click="openEditModal(card)"
                  >
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteAttraction(card.id)"
                  >
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>

              <p class="text-muted mb-3">
                <i class="bi bi-geo-fill me-2"></i>
                {{ card.city }}, {{ card.country }}
              </p>

              <p class="card-text mb-3">
                <i class="bi bi-info-circle me-2"></i>
                {{ card.description }}
              </p>

              <p class="card-text mb-3">
                <i class="bi bi-cash-coin me-2"></i>
                ${{ card.entryFee }}
              </p>

              <div class="button-group">
                <button
                  class="btn btn-outline-primary me-2 w-100 mb-2"
                  @click="openModal(card)"
                >
                  <i class="bi bi-book me-2"></i> Read More
                </button>
                <button
                  class="btn btn-primary w-100"
                  @click="openTripSelectionModal(card)"
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
    <AttractionModal
      v-if="showModal"
      :isOpen="showModal"
      :attraction="selectedAttraction"
      @close="showModal = false"
    />

    <AddEditAttractionModal
      v-if="showAddEditModal"
      :isOpen="showAddEditModal"
      :editMode="editMode"
      :attraction="currentAttraction"
      @close="closeAddEditModal"
      @save="saveAttraction"
    />

    <TripSelectionModal
      v-if="showTripModal"
      :isOpen="showTripModal"
      :trips="userTrips"
      itemType="attraction"
      :error="error"
      :showAlert="showAlert"
      @close="closeTripModal"
      @confirm="addAttractionToTrip"
    />

  </div>
</template>


<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import NavbarMenuForm from "../components/NavbarMenuForm.vue";
import AttractionModal from "../components/Modals/AttractionModal.vue";
import AddEditAttractionModal from "../components/Modals/AddEditAttractionModal.vue";
import TripSelectionModal from "../components/Modals/TripSelectionModal.vue";

export default {
  name: "AttractionsView",
  components: {
    NavbarMenuForm,
    AttractionModal,
    AddEditAttractionModal,
    TripSelectionModal,
  },
  setup() {
    const store = useStore();
    const cards = ref([]);
    const userTrips = ref([]);
    const filterMyAttractions = ref(false); 

    const editMode = ref(false);
    const currentUserId = store.state.userId; 

    const selectedAttraction = ref(null);
    const currentAttraction = ref(null);

    const showModal = ref(false);
    const showAddEditModal = ref(false);
    const showTripModal = ref(false);

    const error = ref(""); 
    const showAlert = ref(false); 

    const gettypeColor = (type) => {
      const colors = {
        Historical: "type-historical",
        Nature: "type-nature",
        Cultural: "type-cultural",
        Adventure: "type-adventure",
        Entertainment: "type-entertainment",
        Other: "type-default",
      };
      return colors[type] || "type-default";
    };

    const fetchCards = async () => {
      try {
        const token = store.state.token;
        console.log("Token:", token);
        const response = await axios.get(
          "http://localhost:8001/api/attraction/get-all-attractions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        cards.value = response.data.attractions.map((attraction) => ({
          id: attraction.id,
          name: attraction.name,
          description: attraction.description,
          country: attraction.country || "Unknown",
          city: attraction.city || "Unknown",
          address: attraction.address || "Unknown",
          openingHours: attraction.openingHours || "Unknown",
          entryFee: attraction.entryFee || "N/A",
          type: attraction.type || "Uncategorized",
          facilities: attraction.facilities || [],
          tags: attraction.tags || [],
          tips: attraction.tips || "No tips available",
          metadata: attraction.metadata || {},
        }));
      } catch (error) {
        console.error("Error fetching attractions:", error);
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

    const deleteAttraction = async (id) => {
      try {
        const token = store.state.token;
        await axios.delete(`http://localhost:8001/api/attraction/delete-attraction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        cards.value = cards.value.filter((card) => card.id !== id);
      } catch (error) {
        console.error("Error deleting attraction:", error);
      }
    };

    const saveAttraction = async (attraction) => {
      try {
        const token = store.state.token;
        let response;

        if (editMode.value) {
          response = await axios.put(
            `http://localhost:8001/api/attraction/update-attraction/${attraction.id}`,
            attraction,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Response:", response.data);

          const updatedAttraction = response.data.attraction;
          const index = cards.value.findIndex((card) => card.id === updatedAttraction.id);

          if (index !== -1) {
            cards.value[index] = { ...cards.value[index], ...updatedAttraction };
            cards.value = [...cards.value];
          }
        } else {
          response = await axios.post(
            "http://localhost:8001/api/attraction/create-attraction",
            attraction,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const newAttraction = response.data.attraction;
          console.log("New Attraction:", newAttraction);
          if (newAttraction && newAttraction.id) {
            cards.value.push(newAttraction);
            cards.value = [...cards.value];
          }
        }
        
        await fetchCards();

        showAddEditModal.value = false;
        
      } catch (error) {
        console.error("Error saving attraction:", error);
      }
    };

    const addAttractionToTrip = async (tripId) => {
      try {
        const token = store.state.token;
        const attractionId = selectedAttraction.value.id; 

        await axios.put(
          `http://localhost:8001/api/trip/${tripId}/add-attraction`, 
          { attractionId }, 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        console.log(`Attraction ${attractionId} added to trip ${tripId}`);
        closeTripModal(); 
      } catch (err) {
        console.error("Error adding attraction to trip:", err);

        const message = err.response?.data?.message || "An error occurred. Please try again later.";
        error.value = message;

        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 5000);
      
      }
    };


    const toggleFilter = () => {
      filterMyAttractions.value = !filterMyAttractions.value;
    };

    const filteredCards = computed(() => {
      return cards.value
        .filter((card) => card && card.id) // Filtering Only valid cards 
        .filter((card) => {
          if (filterMyAttractions.value) {
            return card.metadata?.ownerID === currentUserId;
          }
          return true;
        });
    });


    const openModal = (attraction) => {
      selectedAttraction.value = attraction;
      showModal.value = true;
    };

    const openAddModal = () => {
      currentAttraction.value = null;
      editMode.value = false;
      showAddEditModal.value = true;
    };

    const openEditModal = (attraction) => {
      currentAttraction.value = attraction;
      editMode.value = true;
      showAddEditModal.value = true;
    };

    const openTripSelectionModal = (attraction) => {
      selectedAttraction.value = attraction;
      showTripModal.value = true; 
      fetchTrips(); 
    };

    
    const closeAddEditModal = () => {
      showAddEditModal.value = false;
      currentAttraction.value = null;
    };

    const closeTripModal = () => {
      showTripModal.value = false;
      selectedAttraction.value = null;
    };

    onMounted(() => {
      fetchCards();
    });

    return {
      cards,
      userTrips,
      filterMyAttractions,
      filteredCards,

      editMode,
      currentUserId,
 
      selectedAttraction,
      currentAttraction,

      showModal,
      showAddEditModal,
      showTripModal,

      openModal,
      openAddModal,
      openEditModal,
      openTripSelectionModal,

      closeAddEditModal,
      closeTripModal,

      saveAttraction,
      deleteAttraction,
      addAttractionToTrip,

      gettypeColor,
      toggleFilter,

      error,
      showAlert,
    };
  },
};

</script>

<style scoped>

.attractions-container {
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

.attraction-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  overflow: hidden;
}

.attraction-card:hover {
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

.attraction-card:hover .type-strip {
  width: 8px;
}

/* Type colors */
.type-historical {
  background: linear-gradient(to bottom, #ffabcb, #f51664);
}

.type-nature {
  background: linear-gradient(to bottom, #d2fed3, #5b8d22);
}

.type-cultural {
  background: linear-gradient(to bottom, #ebb4f5, #933ca2);
}

.type-adventure {
  background: linear-gradient(to bottom, #b9e0ff, #1688bd);
}

.type-entertainment {
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

/* hover effects for buttons */
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
