<template>
    <div class="modal fade show d-block" tabindex="-1" v-if="isOpen" @click.self="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-shop me-2"></i>
              {{ restaurant.name }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Basic Details -->
            <p>
              <i class="bi bi-info-circle me-2"></i>
              <strong>Description:</strong> {{ restaurant.description }}
            </p>
            <p>
              <i class="bi bi-house-door me-2"></i>
              <strong>Address:</strong> {{ restaurant.address }}
            </p>
            <p>
              <i class="bi bi-building me-2"></i>
              <strong>City:</strong> {{ restaurant.city }}
            </p>
            <p>
              <i class="bi bi-flag me-2"></i>
              <strong>Country:</strong> {{ restaurant.country }}
            </p>
            <p>
              <i class="bi bi-clock me-2"></i>
              <strong>Opening Hours:</strong> {{ restaurant.openingHours }}
            </p>
            <p>
              <i class="bi bi-cash me-2"></i>
              <strong>Average Cost:</strong> ${{ restaurant.averageCost }}
            </p>
            <p>
              <i class="bi bi-cup-straw me-2"></i>
              <strong>Cuisine:</strong> {{ restaurant.cuisine }}
            </p>
  
            <!-- Tags -->
            <div v-if="restaurant.tags.length">
              <p>
                <i class="bi bi-tags me-2"></i>
                <strong>Tags:</strong>
              </p>
              <ul class="d-inline-flex flex-wrap gap-2">
                <li v-for="tag in restaurant.tags" :key="tag" class="badge">
                  <i class="bi bi-bookmark-heart me-1"></i> {{ tag }}
                </li>
              </ul>
            </div>
  
            <!-- Tips -->
            <div v-if="restaurant.tips.length">
              <p>
                <i class="bi bi-lightbulb me-2"></i>
                <strong>Tips:</strong> {{ restaurant.tips }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "RestaurantModal",
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
      restaurant: {
        type: Object,
        required: true,
      },
    },
    methods: {
      closeModal() {
        this.$emit("close");
      },
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
  
  .modal-body {
    padding-left: 30px;
  }
  
  .modal-body p strong {
    color: #2A0052;
  }
  
  .modal-body li strong {
    color: #312b3b;
  }
  
  .modal-body .badge {
    color: white;
    background-color: #b8b8ff;
  }
  
  .modal-body i {
    color: #2A0052;
    margin-right: 5px;
  }
  
  .modal-body .badge i {
    color: white;
  }
  </style>
  