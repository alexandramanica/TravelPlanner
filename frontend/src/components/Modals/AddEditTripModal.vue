<template>
    <div class="modal fade show d-block" tabindex="-1" @click.self="closeModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi" :class="editMode ? 'bi-pencil' : 'bi-plus-circle'"></i>
              {{ editMode ? 'Edit Trip' : 'Add New Trip' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
  
            <!-- Error Alert -->
            <div v-if="showAlert" class="alert alert-danger mb-4" role="alert">
              <ul class="mb-0 list-unstyled">
                <li v-for="(message, field) in errors" :key="field">
                  <i class="bi bi-exclamation-circle-fill me-2"></i>{{ message }}
                </li>
              </ul>
            </div>
  
            <!-- Form -->
            <form @submit.prevent="submitForm">
              <!-- Name -->
              <div class="mb-3">
                <label for="name" class="form-label">Trip Name</label>
                <input type="text" id="name" v-model="formData.name" class="form-control" placeholder="Trip Name" />
              </div>
  
              <!-- Budget -->
              <div class="mb-3">
                <label for="budget" class="form-label">Budget</label>
                <input type="number" id="budget" v-model="formData.budget" class="form-control" placeholder="Trip Budget" />
              </div>
  
              <!-- Start Date -->
              <div class="mb-3">
                <label for="startDate" class="form-label">Start Date</label>
                <input type="date" id="startDate" v-model="formData.startDate" class="form-control" />
              </div>
  
              <!-- End Date -->
              <div class="mb-3">
                <label for="endDate" class="form-label">End Date</label>
                <input type="date" id="endDate" v-model="formData.endDate" class="form-control" />
              </div>
  
              <!-- Description -->
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" v-model="formData.description" class="form-control" rows="3" placeholder="Brief trip description"></textarea>
              </div>
  
              <!-- Buttons -->
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ editMode ? 'Update Trip' : 'Add Trip' }}</button>
              </div>
            </form>
  
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  import { useStore } from "vuex";
  
  export default {
    name: "AddEditTripModal",
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
      editMode: {
        type: Boolean,
        required: true,
      },
      trip: {
        type: Object,
        default: () => ({}),
      },
    },
  
    setup(props, { emit }) {
      const store = useStore();
      const currentUserId = store.state.userId;
      
      const errors = ref({});
      const showAlert = ref(false);
  

      const formData = ref({
        name: "",
        budget: "",
        startDate: "",
        endDate: "",
        description: "",
        ownerId: currentUserId
      });
  

      const closeModal = () => {
        emit("close");
      };
  
      const validateForm = () => {
        errors.value = {};
        let valid = true;
  
        if (!formData.value.name) {
          errors.value.name = "Trip name is required.";
          valid = false;
        }
        if (!formData.value.budget || formData.value.budget < 0) {
          errors.value.budget = "Please provide a valid budget.";
          valid = false;
        }
        if (!formData.value.startDate) {
          errors.value.startDate = "Start date is required.";
          valid = false;
        }
        if (!formData.value.endDate) {
          errors.value.endDate = "End date is required.";
          valid = false;
        }
        if (!formData.value.description) {
          errors.value.description = "Description is required.";
          valid = false;
        }
  
        showAlert.value = !valid;
        return valid;
      };
  
      const submitForm = () => {
        if (!validateForm()) {
          return;
        }
  
        const tripData = { ...formData.value };
  
        if (props.editMode) {
          tripData.id = props.trip.id;
        }
  
        emit("save", tripData);
      };
  
      watch(
        () => props.trip,
        (newVal) => {
          if (props.editMode && newVal) {
            console.log("Populating form with trip data:", newVal); 
            formData.value = {
              ...newVal
            };
          }
        },
        { immediate: true } 
      );
  
      return {
        formData,
        errors,
        showAlert,
        closeModal,
        submitForm,
      };
    },
  };
  </script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
  text-align: left;
}

.modal-header .modal-title {
  font-weight: 700;
  color: #853acb;
}

.modal-footer .btn-primary {
  background-color: #2a0052;
  border-color: #2a0052;
}

.modal-footer .btn-primary:hover {
  background-color: #bc87e8;
  border-color: #bc87e8;
}

.alert {
  background-color: #d90429;
  color: white;
}
</style>
