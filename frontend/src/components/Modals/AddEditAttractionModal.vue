<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi" :class="editMode ? 'bi-pencil' : 'bi-plus-circle'"></i>
            {{ editMode ? 'Edit Attraction' : 'Add New Attraction' }}
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

          <form @submit.prevent="submitForm">
            <!-- Name -->
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="form-control"
                placeholder="Attraction Name"
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
                placeholder="Brief description of the attraction"
              ></textarea>
            </div>

            <!-- Type -->
            <div class="mb-3">
              <label for="type" class="form-label">Type</label>
              <select id="type" v-model="formData.type" class="form-select">
                <option value="Cultural">Cultural</option>
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Historical">Historical</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Location (City & Country) -->
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

            <!-- Opening Hours -->
            <div class="mb-3">
              <label for="openingHours" class="form-label">Opening Hours</label>
              <input
                type="text"
                id="openingHours"
                v-model="formData.openingHours"
                class="form-control"
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>

            <!-- Entry Fee -->
            <div class="mb-3">
              <label for="entryFee" class="form-label">Entry Fee</label>
              <input
                type="number"
                step="0.01"
                id="entryFee"
                v-model="formData.entryFee"
                class="form-control"
                placeholder="Enter fee in dollars"
                min="0"
              />
            </div>

            <!-- Facilities -->
            <div class="mb-3">
              <label for="facilities" class="form-label">Facilities</label>
              <textarea
                id="facilities"
                v-model="formData.facilities"
                class="form-control"
                rows="2"
                placeholder="Comma-separated list, e.g., Wi-Fi, Parking"
              ></textarea>
            </div>

            <!-- Tags -->
            <div class="mb-3">
              <label for="tags" class="form-label">Tags</label>
              <textarea
                id="tags"
                v-model="formData.tags"
                class="form-control"
                rows="2"
                placeholder="Comma-separated tags, e.g., Family-Friendly, Nature"
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="tips" class="form-label">Tips</label>
              <textarea
                id="tips"
                v-model="formData.tips"
                class="form-control"
                rows="2"
                placeholder="Your tips for visiting this attraction"
              ></textarea>
            </div>

            <!-- Buttons -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editMode ? 'Update Attraction' : 'Add Attraction' }}
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
  name: "AddEditAttractionModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    attraction: {
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
      ownerId:currentUserId,
      name: "",
      description: "",
      type: "Cultural",
      city: "",
      country: "",
      address: "",
      openingHours: "",
      entryFee: "",
      facilities: "",
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
      if (!formData.value.type) {
        errors.value.type = "Type is required.";
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
      if (!formData.value.openingHours) {
        errors.value.openingHours = "Opening hours are required.";
        valid = false;
      }
      if (!formData.value.entryFee) {
        errors.value.entryFee = "Entry fee is required.";
        valid = false;
      }
      if (formData.value.entryFee < 0) {
        errors.value.entryFee = "Entry fee must be a positive number.";
        valid = false;
      }
      if (!formData.value.facilities) {
        errors.value.facilities = "Facilities are required.";
        valid = false;
      }
      if (formData.value.facilities) {
        const facilities = formData.value.facilities.split(",");
        if (facilities.length > 5) {
          errors.value.facilities = "Maximum of 5 facilities allowed.";
          valid = false;
        }
      }
      if (formData.value.tags) {
        const tags = formData.value.tags.split(",");
        if (tags.length > 5) {
          errors.value.tags = "Maximum of 5 tags allowed.";
          valid = false;
        }
      }
      if (!formData.value.tags) {
        errors.value.tags = "Tags are required.";
        valid = false;
      }
      if (!formData.value.tips) {
        errors.value.tips = "Tips are required.";
        valid = false;
      }


      showAlert.value = !valid;

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
      const updatedAttraction = {
        ...formData.value,
        facilities: formData.value.facilities.split(",").map((f) => f.trim()),
        tags: formData.value.tags.split(",").map((t) => t.trim()),
      };

      console.log("Updated Attraction Data Sent:", updatedAttraction);

      if (props.editMode) {
        updatedAttraction.id = props.attraction.id;
      }

      emit("save", updatedAttraction);
    };

    // For editing purposes
    watch(
      () => props.attraction, 
      (newVal) => {
        if (props.editMode && newVal) {
          console.log("Populating form with attraction data:", newVal); 
          formData.value = {
            ...newVal,
            facilities: Array.isArray(newVal.facilities) ? newVal.facilities.join(", ") : "",
            tags: Array.isArray(newVal.tags) ? newVal.tags.join(", ") : "",
          };
        }
      },
      { immediate: true } // For the first time opening
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

