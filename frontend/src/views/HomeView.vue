<template>
  <div class="container">
    <div class="text-section">
      <p class="subheading">Your Gateway to the World</p>
      <h1 class="main-heading">Discover destinations<br /> book experiences, <br />and plan trips — all in one place.</h1>
      <button class="shop-now">
          <router-link to="/register" class="text-white">
            Register Now
          </router-link>
        <span class="arrow">→</span>
      </button>
    </div>
    <div class="image-section">
      <img src="../assets/homeImage.jpg" alt="Healthy Chicken Salad" />
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px;
}

.text-section {
  max-width: 50%;
  text-align: left;
}

.subheading {
  color: #bc87e8; /* Green color */
  font-weight: bold;
  font-size: 1.2rem;
}

.main-heading {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.4;
  color: #333;
  margin: 10px 0;
}

.shop-now {
  background-color: #bc87e8; 
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.shop-now:hover {
  background-color: #2a0052; 
}

.image-section {
  max-width: 50%;
 
}

.image-section img {
  width: 100%;
  border-radius: 10px;
}
</style>
