<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="isOpen" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-geo-alt-fill me-2"></i>
            {{ attraction.name }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Basic Details -->
          <p><strong>Description:</strong> {{ attraction.description }}</p>
          <p><strong>Address:</strong> {{ attraction.address }}</p>
          <p><strong>City:</strong> {{ attraction.city }}</p>
          <p><strong>Country:</strong> {{ attraction.country }}</p>
          <p><strong>Opening Hours:</strong> {{ attraction.openingHours }}</p>
          <p><strong>Entry Fee:</strong> ${{ attraction.entryFee }}</p>

          <!-- Facilities -->

          <div v-if="attraction.facilities.length">
            <p><strong>Facilities:</strong></p>
            <ul class="d-inline-flex flex-wrap gap-2">
              <li v-for="facility in attraction.facilities" :key="facility" class="badge">{{ facility }}</li>
            </ul>
          </div>

          <!-- Tags -->
          <div v-if="attraction.tags.length">
            <p><strong>Tags:</strong></p>
            <ul class="d-inline-flex flex-wrap gap-2">
              <li v-for="tag in attraction.tags" :key="tag" class="badge">{{ tag }}</li>
            </ul>
          </div>

          <!-- Tips -->
          <div v-if="attraction.tips.length">
            <p><strong>Tips:</strong></p>
            <ul>
              <li v-for="tip in attraction.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <!-- Transportation Options -->
          <div v-if="attraction.transportationOptions.length">
            <p><strong>Transportation Options:</strong></p>
            <ul>
              <li
                v-for="(option, index) in attraction.transportationOptions"
                :key="index"
              >
                <strong>Type:</strong> {{ option.type }} <br />
                <strong>Details:</strong> {{ option.details }} <br />
                <strong>Cost:</strong> ${{ option.cost }}
              </li>
            </ul>
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
</style>
