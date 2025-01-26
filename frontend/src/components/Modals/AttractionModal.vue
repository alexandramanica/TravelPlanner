<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="isOpen" @click.self="closeModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-geo-alt me-2"></i>
            {{ attraction.name }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Basic Details -->
          <p>
            <i class="bi bi-info-circle me-2"></i>
            <strong>Description:</strong> {{ attraction.description }}
          </p>
          <p>
            <i class="bi bi-house-door me-2"></i>
            <strong>Address:</strong> {{ attraction.address }}
          </p>
          <p>
            <i class="bi bi-building me-2"></i>
            <strong>City:</strong> {{ attraction.city }}
          </p>
          <p>
            <i class="bi bi-flag me-2"></i>
            <strong>Country:</strong> {{ attraction.country }}
          </p>
          <p>
            <i class="bi bi-clock me-2"></i>
            <strong>Opening Hours:</strong> {{ attraction.openingHours }}
          </p>
          <p>
            <i class="bi bi-cash me-2"></i>
            <strong>Entry Fee:</strong> ${{ attraction.entryFee }}
          </p>

          <!-- Facilities -->
          <div v-if="attraction.facilities.length">
            <p>
              <i class="bi bi-wrench-adjustable me-2"></i>
              <strong>Facilities:</strong>
            </p>
            <ul class="d-inline-flex flex-wrap gap-2">
              <li v-for="facility in attraction.facilities" :key="facility" class="badge">
                <i class="bi bi-check-circle me-1"></i> {{ facility }}
              </li>
            </ul>
          </div>

          <!-- Tags -->
          <div v-if="attraction.tags.length">
            <p>
              <i class="bi bi-tags me-2"></i>
              <strong>Tags:</strong>
            </p>
            <ul class="d-inline-flex flex-wrap gap-2">
              <li v-for="tag in attraction.tags" :key="tag" class="badge">
                <i class="bi bi-bookmark-heart me-1"></i> {{ tag }}
              </li>
            </ul>
          </div>

          <!-- Tips -->
          <div v-if="attraction.tips.length">
            <p>
              <i class="bi bi-lightbulb me-2"></i>
              <strong>Tips:</strong> {{ attraction.tips }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "AttractionModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    attraction: {
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

.modal-title{
  color: #853acb;
  font-weight: 700;
}

.modal-body{
  padding-left: 30px;
}

.modal-body p strong{
  color: #2A0052;
}

.modal-body li strong {
  color: #312b3b;
}

.modal-body .badge{
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
