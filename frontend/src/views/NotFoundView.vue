<template>
    <div class="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p> The page you're looking for doesn't exist.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFoundView",
  };
  </script>
  
  <style scoped>
  .not-found-container {
    text-align: center;
    padding: 50px;
    color: #2a0052;
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  </style>
  