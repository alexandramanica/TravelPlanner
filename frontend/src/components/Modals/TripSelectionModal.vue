<template>
    <div
      v-if="isOpen" 
      class="modal fade show"
      style="display: block; background: rgba(0, 0, 0, 0.5);"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          
          <div class="modal-header">
            <h5 class="modal-title">
                <i class="bi bi-suitcase-fill me-2"></i>
                Select a Trip
            </h5>
          </div>
          <div class="modal-body">
            <p>Choose a trip to add the {{ itemType || 'item' }} to:</p>
            <div class="list-group">
              <button
                v-for="trip in trips"
                :key="trip.id"
                type="button"
                class="list-group-item list-group-item-action"
                :class="{ active: trip.id === selectedTrip }"
                @click="selectedTrip = trip.id"
              >
                {{ trip.name }}
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            <button
              class="btn btn-primary"
              :disabled="!selectedTrip"
              @click="confirmSelection"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      <div v-if="showAlert" class="alert alert-danger mt-3 d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-circle-fill me-2"></i>
        {{ error }}
    </div>

    </div>
  </template>
  

<script>
import { ref } from "vue";

export default {
  name: "TripSelectionModal",
  props: {
    isOpen: { type: Boolean, required: true }, 
    trips: { type: Array, required: true }, 
    itemType: { type: String, default: "item" }, 
    error: { type: String, default: "" }, 
    showAlert: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const selectedTrip = ref(null);

    const selectTrip = (trip) => {
      selectedTrip.value = trip.id;
    };

    const confirmSelection = () => {
      emit("confirm", selectedTrip.value);
    };

    return {
      selectedTrip,
      selectTrip,
      confirmSelection,
    };
  },
};
</script>

<style scoped>
.modal-body {
  max-height: 300px;
  overflow-y: auto;
}
.btn-group-vertical .btn {
  margin-bottom: 0.5rem;
}

.modal-title{
    color: #853acb;
    font-weight: 700;
}

.btn-primary {
  background-color: #2a0052;
  border-color: #2a0052;
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-primary:disabled {
  background-color: #b8b8ff;
  border-color: #b8b8ff;
  color: white;
}

.btn-primary:hover {
  background-color: #853acb;
  border-color: #2a0052;
}

.list-group-item-action.active {
  background-color: #BC87E8;
  border-color: #BC87E8;
  color: white;
}

.list-group-item-action:hover {
  background-color: #f3e5ff;
  color: #2a0052;
}

.alert {
    position: fixed;
    bottom: 10px;
    right: 20px;
    background-color: #d90429;
    color: #ffffff;
    z-index: 1000;
  }

</style>
