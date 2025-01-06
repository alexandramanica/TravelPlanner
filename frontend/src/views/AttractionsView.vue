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

      <div class="row g-4">
        <div
          v-for="card in cards"
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
                  <i class="bi bi-geo-alt-fill me-2"></i>
                  {{ card.name }}
                </h3>
                <span class="badge bg-primary rounded-pill">
                  {{ card.rating || "N/A" }} <i class="bi bi-star-fill"></i>
                </span>
              </div>

              <p class="text-muted mb-3">
                <i class="bi bi-geo-fill me-2"></i>
                {{ card.city }}, {{ card.country }}
              </p>

              <p class="card-text mb-3">
                <i class="bi bi-info-circle me-2"></i>
                {{ card.description }}
              </p>

              <div class="button-group">
                <button
                  class="btn btn-outline-primary me-2 w-100 mb-2"
                  @click="openModal(card)"
                >
                  <i class="bi bi-book me-2"></i> Read More
                </button>
                <button class="btn btn-primary w-100">
                  <i class="bi bi-suitcase me-2"></i> Add to My Trips
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AttractionModal
      v-if="showModal"
      :isOpen="showModal"
      :attraction="selectedAttraction"
      @close="showModal = false"
    />
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import NavbarMenuForm from "../components/NavbarMenuForm.vue";
import AttractionModal from "../components/AttractionModal.vue";

export default {
  name: "AttractionsView",
  components: {
    NavbarMenuForm,
    AttractionModal,
  },
  setup() {
    const cards = ref([]);
    const store = useStore();
    const showModal = ref(false);
    const selectedAttraction = ref(null);

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

    const openModal = (attraction) => {
      selectedAttraction.value = attraction;
      showModal.value = true;
    };

    const fetchCards = async () => {
      try {
        const token = store.state.token;
        if (!token) {
          throw new Error("Token not found in store.");
        }

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
          transportationOptions: attraction.transportationOptions || [],
          tips: attraction.tips || [],
          metadata: attraction.metadata || {},
        }));
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };

    onMounted(() => {
      fetchCards();
    });

    return {
      cards,
      showModal,
      selectedAttraction,
      openModal,
      gettypeColor,
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
  font-size: 3rem;
  text-align: left;
  text-decoration: underline;
}

.container .page-subtitle {
  font-size: 1.25rem;
  color: #2A0052;
  text-align: left;
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

/* type colors */
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

/* Badge styling */
.badge {
  padding: 0.5em 0.8em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .card-title {
    font-size: 1.1rem;
  }

  .details-section {
    font-size: 0.85rem;
  }
}
</style>
