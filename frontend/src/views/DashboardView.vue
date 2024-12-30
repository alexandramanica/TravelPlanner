<template>
    <div class="dashboard-root">
      <SidebarForm />
      <div class="container">
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <h1 class="text-center">Dashboard</h1>
            <p class="text-center">Welcome to the Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import SidebarForm from '../components/SidebarForm.vue';
  
  export default {
    name: 'DashboardView',
    components: { SidebarForm },
  };
  </script>
  