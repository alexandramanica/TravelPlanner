<template>
    <div class="app">
      <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
          <!-- Brand -->
          <a class="navbar-brand" href="#">
            <i class="bi bi-globe-americas me-2"></i>
            Explore
          </a>
          <!-- Toggler -->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="bi bi-list"></i> 
          </button>
          <!-- Navbar Links -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link to="/trips" class="nav-link">
                  <i class="bi bi-suitcase me-2"></i>
                  My trips
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/attractions" class="nav-link">
                  <i class="bi bi-geo-alt me-2"></i>
                  Attractions
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/restaurants" class="nav-link">
                  <i class="bi bi-shop me-2"></i>
                  Restaurants
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/activities" class="nav-link">
                  <i class="bi bi-calendar-event me-2"></i>
                  Activities
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  
  <script>
    export default {
        name: "NavbarMenuForm",
    };
  </script>
  
 
<style scoped>
    .navbar {
    background: linear-gradient(135deg, #2a0052 0%, #4a0082 100%);
    padding: 0.5rem 0;
    height: auto;
    }

    .navbar-brand {
    color: #fff;
    font-size: 1.5rem; 
    font-weight: bold;
    }

    .navbar-brand:hover {
    color: rgba(255, 255, 255, 0.9);
    }

    .navbar-toggler {
    border: none;
    background: transparent;
    color: #fff;
    font-size: 1.5rem;
    }

    .nav-link {
    color: rgba(255, 255, 255, 0.8);
    padding: 0.5rem 1rem;
    transition: color 0.3s ease, transform 0.2s ease;
    position: relative;
    white-space: nowrap;
    }

    .nav-link:hover {
    color: #fff;
    transform: translateY(-1px);
    }

    .nav-link.active {
    color: #fff;
    }

    .main-content {
    padding: 1rem;
    padding-top: 4rem; 
    }

    @media (max-width: 991.98px) {
    .navbar-nav {
        padding: 0.5rem 0;
    }

    .nav-link {
        padding: 0.5rem 1rem;
        font-size: 1rem; 
    }

    .navbar-collapse {
        background: linear-gradient(135deg, #2a0052 0%, #4a0082 100%);
        padding: 0.5rem;
    }
    }

    @media (max-width: 575.98px) {
    .main-content {
        padding-top: 3.5rem; 
    }

    .navbar {
        padding: 0.25rem 0.5rem;
    }

    .nav-link {
        font-size: 0.9rem;
        padding: 0.4rem 1rem;
    }

    .nav-link.active-link::after {
        content: '';
        position: absolute;
        bottom: -2px; 
        left: 0;
        right: 0;
        height: 2px;
        background-color: #ff74ff; 
        }
    }
</style>