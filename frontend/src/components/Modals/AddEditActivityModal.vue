<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi" :class="editMode ? 'bi-pencil' : 'bi-plus-circle'"></i>
            {{ editMode ? 'Edit Activity' : 'Add New Activity' }}
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
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="form-control"
                placeholder="Activity Name"
              />
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                v-model="formData.description"
                class="form-control"
                rows="3"
                placeholder="Brief description of the activity"
              ></textarea>
            </div>

            <!-- Category -->
            <div class="mb-3">
              <label for="category" class="form-label">Category</label>
              <select id="category" v-model="formData.category" class="form-select">
                <option value="">Select Category</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Location -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="city" class="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  v-model="formData.city"
                  class="form-control"
                  placeholder="City"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="country" class="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  v-model="formData.country"
                  class="form-control"
                  placeholder="Country"
                />
              </div>
            </div>

            <!-- Address -->
            <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <input
                type="text"
                id="address"
                v-model="formData.address"
                class="form-control"
                placeholder="Street Address"
              />
            </div>

            <!-- Duration -->
            <div class="mb-3">
              <label for="duration" class="form-label">Duration</label>
              <input
                type="text"
                id="duration"
                v-model="formData.duration"
                class="form-control"
                placeholder="e.g., 2 hours, Half-day"
              />
            </div>

            <!-- Price -->
            <div class="mb-3">
              <label for="price" class="form-label">Price</label>
              <input
                type="number"
                id="price"
                step="0.01"
                v-model="formData.price"
                class="form-control"
                placeholder="Enter price in dollars"
                min="0"
              />
            </div>

            <!-- Tags -->
            <div class="mb-3">
              <label for="tags" class="form-label">Tags</label>
              <textarea
                id="tags"
                v-model="formData.tags"
                class="form-control"
                rows="2"
                placeholder="Comma-separated tags, e.g., Team-Building, Adventure"
              ></textarea>
            </div>

            <!-- Tips -->
            <div class="mb-3">
              <label for="tips" class="form-label">Tips</label>
              <textarea
                id="tips"
                v-model="formData.tips"
                class="form-control"
                rows="2"
                placeholder="Your tips for enjoying this activity"
              ></textarea>
            </div>

            <!-- Buttons -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editMode ? 'Update Activity' : 'Add Activity' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


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
  position: fixed;
  bottom: 10px;
  right: 20px;
  background-color: #d90429;
  color: #ffffff;
}
</style>

<script>
import { ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "AddEditActivityModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    activity: {
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
      ownerId: currentUserId,
      name: "",
      description: "",
      category: "Outdoor",
      city: "",
      country: "",
      address: "",
      duration: "",
      price: 0,
      tags: "",
      tips: "",
    });

    const closeModal = () => {
      emit("close");
    };

    const validateForm = () => {
      let valid = true;
      errors.value = {};

      if (!formData.value.name) {
        errors.value.name = "Name is required.";
        valid = false;
      }
      if (!formData.value.description) {
        errors.value.description = "Description is required.";
        valid = false;
      }
      if (!formData.value.category) {
        errors.value.category = "Category is required.";
        valid = false;
      }
      if (!formData.value.city) {
        errors.value.city = "City is required.";
        valid = false;
      }
      if (!formData.value.country) {
        errors.value.country = "Country is required.";
        valid = false;
      }
      if (!formData.value.address) {
        errors.value.address = "Address is required.";
        valid = false;
      }
      if (!formData.value.duration) {
        errors.value.duration = "Duration is required.";
        valid = false;
      }
      if (!formData.value.price) {
        errors.value.price = "Price is required.";
        valid = false;
      }
      if (formData.value.price < 0) {
        errors.value.price = "Price must be a positive number.";
        valid = false;
      }
      if (!formData.value.tags) {
        errors.value.tags = "Tags are required.";
        valid = false;
      }
      if (formData.value.tags) {
        const tags = formData.value.tags.split(",");
        if (tags.length > 5) {
          errors.value.tags = "Maximum of 5 tags allowed.";
          valid = false;
        }
      }
      if (!formData.value.tips) {
        errors.value.tips = "Tips are required.";
        valid = false;
      }

      
      if (!valid) {
        showAlert.value = true;
        
        setTimeout(() => {
          showAlert.value = false;
        }, 5000);
      }

      return valid;
    };

    const submitForm = () => {
      if (!validateForm()) {
        return;
      }

      const updatedActivity = {
        ...formData.value,
        tags: formData.value.tags.split(",").map((t) => t.trim()),
      };

      console.log("Updated Activity Data Sent:", updatedActivity);

      if (props.editMode) {
        updatedActivity.id = props.activity.id;
      }

      emit("save", updatedActivity);
    };

    // For editing purposes
    watch(
      () => props.activity,
      (newVal) => {
        if (props.editMode && newVal) {
          console.log("Populating form with activity data:", newVal);
          formData.value = {
            ...newVal,
            tags: Array.isArray(newVal.tags) ? newVal.tags.join(", ") : "",
          };
        }
      },
      { immediate: true }
    );

    return {
      errors,
      showAlert,
      formData,
      closeModal,
      submitForm,
    };
  },
};
</script>
