<template>
    <div class="restaurants-container bg-light py-4">
      <NavbarMenuForm />
      <div class="container">
        <h1 class="page-title display-4 mb-4">Popular Restaurants</h1>
        <h2 class="page-subtitle mb-4">
          Discover top-rated restaurants around the world, offering diverse cuisines and unforgettable dining experiences.
        </h2>
  
        <!-- Filter Toggle -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <button class="btn btn-outline-primary" @click="toggleFilter">
            <i class="bi" :class="filterMyRestaurants ? 'bi-person-check' : 'bi-list'"></i>
            {{ filterMyRestaurants ? 'Show All' : 'Show My Restaurants' }}
          </button>
          <button class="btn btn-primary" @click="openAddModal">
            <i class="bi bi-plus-circle"></i> Add Restaurant
          </button>
        </div>
  
        <div class="row g-4">
          <div
            v-for="card in filteredCards"
            :key="card.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="card h-100 border-0 shadow-sm restaurant-card">
                <div
                class="type-strip"
                :class="getCuisineColor(card.cuisine)"
                ></div>
                <div class="card-body position-relative">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                    <h3 class="card-title mb-0">
                        <i class="bi bi-shop me-2"></i>
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
                      @click="deleteRestaurant(card.id)"
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
                  Average Cost: ${{ card.averageCost }}
                </p>
  
                <div class="button-group">
                  <button
                    class="btn btn-outline-primary me-2 w-100 mb-2"
                    @click="openModal(card)"
                  >
                    <i class="bi bi-book me-2"></i> Read More
                  </button>
                  <button class="btn btn-primary w-100">
                    <i class="bi bi-suitcase me-2"></i> Add to My Favorites
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modals -->
      <RestaurantModal
        v-if="showModal"
        :isOpen="showModal"
        :restaurant="selectedRestaurant"
        @close="showModal = false"
      />
  
      <AddEditRestaurantModal
        v-if="showAddEditModal"
        :isOpen="showAddEditModal"
        :editMode="editMode"
        :restaurant="currentRestaurant"
        @close="closeAddEditModal"
        @save="saveRestaurant"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import { useStore } from "vuex";
  import NavbarMenuForm from "../components/NavbarMenuForm.vue";
  import RestaurantModal from "../components/Modals/RestaurantModal.vue";
  import AddEditRestaurantModal from "../components/Modals/AddEditRestaurantModal.vue";
  
  export default {
    name: "RestaurantsView",
    components: {
      NavbarMenuForm,
      RestaurantModal,
      AddEditRestaurantModal,
    },
    setup() {
      const store = useStore();
      const cards = ref([]);
      const showModal = ref(false);
      const selectedRestaurant = ref(null);
      const showAddEditModal = ref(false);
      const currentRestaurant = ref(null);
      const editMode = ref(false);
      const currentUserId = store.state.userId;
      const filterMyRestaurants = ref(false);

      const getCuisineColor = (cuisine) => {
      const colors = {
        Chinese: "type-chinese",
        Italian: "type-italian",
        American: "type-american",
        Indian: "type-indian",
        Mexican: "type-mexican",
        Other: "type-default",
      };
      return colors[cuisine] || "type-default";
    };
  
      const fetchCards = async () => {
        try {
          const token = store.state.token;
          const response = await axios.get("http://localhost:8001/api/restaurant/get-all-restaurants", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          cards.value = response.data.restaurants.map((restaurant) => ({
            id: restaurant.id,
            ...restaurant,
          }));
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      };
  
      const deleteRestaurant = async (id) => {
        try {
          const token = store.state.token;
          await axios.delete(`http://localhost:8001/api/restaurant/delete-restaurant/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          cards.value = cards.value.filter((card) => card.id !== id);
        } catch (error) {
          console.error("Error deleting restaurant:", error);
        }
      };
  
      const saveRestaurant = async (restaurant) => {
        try {
          const token = store.state.token;
          let response;
  
          if (editMode.value) {
            response = await axios.put(
              `http://localhost:8001/api/restaurant/update-restaurant/${restaurant.id}`,
              restaurant,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            const updatedRestaurant = response.data.restaurant;
            const index = cards.value.findIndex((card) => card.id === updatedRestaurant.id);
            if (index !== -1) {
              cards.value[index] = { ...cards.value[index], ...updatedRestaurant };
              cards.value = [...cards.value];
            }
          } else {
            response = await axios.post(
              "http://localhost:8001/api/restaurant/create-restaurant",
              restaurant,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            const newRestaurant = response.data.restaurant;
            if (newRestaurant && newRestaurant.id) {
              cards.value.push(newRestaurant);
              cards.value = [...cards.value];
            }
          }
  
          await fetchCards();
          showAddEditModal.value = false;

        } catch (error) {
          console.error("Error saving restaurant:", error);
        }
      };
  
      const toggleFilter = () => {
        filterMyRestaurants.value = !filterMyRestaurants.value;
      };
  
      const filteredCards = computed(() => {
        return cards.value
          .filter((card) => card && card.id)
          .filter((card) => {
            if (filterMyRestaurants.value) {
              return card.metadata?.ownerID === currentUserId;
            }
            return true;
          });
      });
  
      const openModal = (restaurant) => {
        selectedRestaurant.value = restaurant;
        showModal.value = true;
      };
  
      const openAddModal = () => {
        currentRestaurant.value = null;
        editMode.value = false;
        showAddEditModal.value = true;
      };
  
      const openEditModal = (restaurant) => {
        currentRestaurant.value = restaurant;
        editMode.value = true;
        showAddEditModal.value = true;
      };
  
      const closeAddEditModal = () => {
        showAddEditModal.value = false;
        currentRestaurant.value = null;
      };
  
      onMounted(() => {
        fetchCards();
      });
  
      return {
        cards,
        getCuisineColor,
        selectedRestaurant,
        currentUserId,
        editMode,
        currentRestaurant,
        showModal,
        showAddEditModal,
        openModal,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        saveRestaurant,
        deleteRestaurant,
        toggleFilter,
        filterMyRestaurants,
        filteredCards,
      };
    },
  };
  </script>
  
  <style scoped>
    .restaurants-container {
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

    .restaurant-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    overflow: hidden;
    }

    .restaurant-card:hover {
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

    .restaurant-card:hover .type-strip {
    width: 8px;
    }

    /* Type colors */
    .type-italian {
    background: linear-gradient(to bottom, #ffabcb, #f51664);
    }

    .type-chinese {
    background: linear-gradient(to bottom, #d2fed3, #5b8d22);
    }

    .type-american {
    background: linear-gradient(to bottom, #ebb4f5, #933ca2);
    }

    .type-indian {
    background: linear-gradient(to bottom, #b9e0ff, #1688bd);
    }

    .type-mexican {
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

    /* Filter button*/
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
  