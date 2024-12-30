<template>
    <div class="app">
      <!-- Sidebar -->
      <aside :class="{ open: isSidebarOpen }" class="sidebar">
        <div class="sidebar-header">
          <h2>My Sidebar</h2>
          <button class="close-btn" @click="toggleSidebar">×</button>
        </div>
        <nav class="sidebar-nav">
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/services">Services</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="main-content">
        <button class="toggle-btn" @click="toggleSidebar">☰</button>
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'SidebarForm',
    setup() {
      const isSidebarOpen = ref(false);
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      return {
        isSidebarOpen,
        toggleSidebar,
      };
    },
  };
  </script>


<style scoped>

body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* App Container */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #2a0052;
  color: white;
  position: fixed;
  top: 0;
  left: -250px;
  height: 100%;
  overflow-y: auto;
  transition: left 0.3s ease-in-out;
  z-index: 1000;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2a0052;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin: 1rem 0;
}

.sidebar-nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
  transition: background-color 0.3s ease;
}

.sidebar-nav a:hover {
  background-color: #4c178b;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Main Content */
.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 1rem;
  transition: margin-left 0.3s ease-in-out;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
}

.sidebar.open ~ .main-content {
  margin-left: 250px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    left: -100%;
  }

  .sidebar.open {
    left: 0;
  }

  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>
