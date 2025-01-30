<template>
    <div class="modal fade show d-block" tabindex="-1" v-if="isOpen && trip" @click.self="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-suitcase me-2"></i>
              {{ trip.name }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><i class="bi bi-cash me-2"></i><strong>Budget:</strong> ${{ trip.budget }}</p>
            <p><i class="bi bi-calendar-event me-2"></i><strong>Start Date:</strong> {{ trip.startDate }}</p>
            <p><i class="bi bi-calendar-check me-2"></i><strong>End Date:</strong> {{ trip.endDate }}</p>
            <p><i class="bi bi-info-circle me-2"></i><strong>Description:</strong> {{ trip.description || 'No description available.' }}</p>
  
            <!-- Budget Status -->
            <div :class="{'text-danger': isOverBudget, 'text-success': !isOverBudget}" class="mt-4" style="font-weight: bold;">
              <i class="bi bi-exclamation-circle me-2" v-if="isOverBudget"></i>
              <i class="bi bi-check-circle me-2" v-else></i>
              {{ budgetStatusMessage }}
            </div>

            <!-- Attractions Section -->
            <div v-if="trip.attractionsSnapshot?.length">
              <h5 class="section-title mt-4"><i class="bi bi-geo-alt me-2"></i>Attractions</h5>
              <ul class="list-group mb-3">
                <li v-for="attraction in trip.attractionsSnapshot" 
                :key="attraction.id" 
                class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <p><strong>{{ attraction.name }}</strong> - ${{ attraction.entryFee || 'N/A' }}</p>
                    <p class="text-muted">{{ attraction.description }}</p>
                  </div>
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="deleteAttraction(attraction.id)"
                    ><i class="bi bi-trash"></i>
                  </button>
                </li>
              </ul>
            </div>
  
            <!-- Restaurants Section -->
            <div v-if="trip.restaurantsSnapshot?.length">
              <h5 class="section-title mt-4"><i class="bi bi-shop me-2"></i>Restaurants</h5>
              <ul class="list-group mb-3">
                <li v-for="restaurant in trip.restaurantsSnapshot" 
                :key="restaurant.id" 
                class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <p><strong>{{ restaurant.name }}</strong> - ${{ restaurant.averageCost || 'N/A' }}</p>
                    <p class="text-muted">{{ restaurant.description }}</p>
                  </div>
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="deleteRestaurant(restaurant.id)"
                    ><i class="bi bi-trash"></i>
                  </button>
                </li>
              </ul>
            </div>
  
            <!-- Activities Section -->
            <div v-if="trip.activitiesSnapshot?.length">
              <h5 class="section-title mt-4"><i class="bi bi-calendar-event me-2"></i>Activities</h5>
              <ul class="list-group">
                <li v-for="activity in trip.activitiesSnapshot" 
                :key="activity.id" 
                class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <p><strong>{{ activity.name }}</strong> - ${{ activity.price || 'N/A' }}</p>
                    <p class="text-muted">{{ activity.description }}</p>
                  </div>
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="deleteActivity(activity.id)"
                    ><i class="bi bi-trash"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { reactive, watch, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";

export default {
  name: "TripModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    trip: {
      type: Object,
      required: true,
    },
    fetchTrips: {
      type: Function, 
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    console.log("Props.fetchTrips:", props.fetchTrips);

    const localTrip = reactive({
      ...props.trip,
      attractionsSnapshot: props.trip.attractionsSnapshot || [],
      restaurantsSnapshot: props.trip.restaurantsSnapshot || [],
      activitiesSnapshot: props.trip.activitiesSnapshot || [],
    });

    watch(
      () => props.trip,
      (newTrip) => {
        localTrip.attractionsSnapshot = newTrip.attractionsSnapshot || [];
        localTrip.restaurantsSnapshot = newTrip.restaurantsSnapshot || [];
        localTrip.activitiesSnapshot = newTrip.activitiesSnapshot || [];
      },
      { immediate: true, deep: true }
    );

    const closeModal = () => {
      emit("close");
    };

    const deleteAttraction = async (id) => {
      try {
        const token = store.state.token;
        await axios.delete(`http://localhost:8001/api/trip/${props.trip.id}/delete-attraction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localTrip.attractionsSnapshot = localTrip.attractionsSnapshot.filter((item) => item.id !== id);

        await props.fetchTrips();
      } catch (error) {
        console.error("Error deleting attraction:", error);
      }
    };

    const deleteActivity = async (id) => {
      try {
        const token = store.state.token;
        await axios.delete(`http://localhost:8001/api/trip/${props.trip.id}/delete-activity/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

       localTrip.activitiesSnapshot = localTrip.activitiesSnapshot.filter((item) => item.id !== id);

        await props.fetchTrips();
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    };

    const deleteRestaurant = async (id) => {
      try {
        const token = store.state.token;
        await axios.delete(`http://localhost:8001/api/trip/${props.trip.id}/delete-restaurant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localTrip.restaurantsSnapshot = localTrip.restaurantsSnapshot.filter((item) => item.id !== id);

        await props.fetchTrips();
      } catch (error) {
        console.error("Error deleting restaurant:", error);
      }
    };

    const totalTripCost = computed(() => {
      const attractionCost = localTrip.attractionsSnapshot.reduce(
        (total, attraction) => total + (attraction.entryFee || 0),
        0
      );
      const restaurantCost = localTrip.restaurantsSnapshot.reduce(
        (total, restaurant) => total + (restaurant.averageCost || 0),
        0
      );
      const activityCost = localTrip.activitiesSnapshot.reduce(
        (total, activity) => total + (activity.price || 0),
        0
      );

      return attractionCost + restaurantCost + activityCost;
    });

    const isOverBudget = computed(() => totalTripCost.value > props.trip.budget);

    const budgetStatusMessage = computed(() => {
      const budgetDifference = Math.round(Math.abs(totalTripCost.value - props.trip.budget));

      return isOverBudget.value
        ? `You're over budget by $${budgetDifference}. Consider reviewing your expenses to stay on track.`
        : `Great job! You are under budget by $${budgetDifference}. You have room for extra activities or savings!`;
     });

    return {
      closeModal,
      deleteAttraction,
      deleteActivity,
      deleteRestaurant,
      localTrip,
      isOverBudget,
      budgetStatusMessage,
    };
  },
};
  </script>
  

  <style scoped>
  .modal {
    background: rgba(0, 0, 0, 0.5);
    text-align: left;
  }
  
  .modal-title {
    color: #853acb;
    font-weight: 700;
  }
  
  .section-title {
    color: #2A0052;
    font-weight: bold;
  }
  
  .list-group-item {
    border: 1px solid #ddd;
    padding: 15px;
  }
  
  .modal-body p strong {
    color: #2A0052;
  }
  </style>
  