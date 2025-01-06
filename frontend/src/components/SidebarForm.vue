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
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <i class="bi bi-house-door me-2"></i>
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">
                <i class="bi bi-info-circle me-2"></i>
                About
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/services" class="nav-link">
                <i class="bi bi-briefcase me-2"></i>
                Services
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link">
                <i class="bi bi-envelope me-2"></i>
                Contact
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
/* Navbar */
.navbar {
  background: linear-gradient(135deg, #2a0052 0%, #4a0082 100%);
  padding: 0.5rem 1rem;
  height: auto;
  transition: all 0.3s ease-in-out;
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
  border-color: rgba(255, 255, 255, 0.3);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.7%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  position: relative;
  transition: color 0.3s ease, transform 0.2s ease;
}

.nav-link:hover {
  color: #fff;
  transform: translateY(-1px);
}

.nav-link.active {
  color: #fff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background: #ff74ff;
}

/* Main Content */
.main-content {
  min-height: 100vh;
}

/* Responsive Adjustments */
@media (max-width: 991.98px) {
  .navbar-nav {
    flex-direction: column;
    padding: 0.5rem 0;
  }

  .nav-link {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
  }

  .nav-link.active::after {
    left: 0;
    right: 0;
  }

  .navbar-collapse {
    background: linear-gradient(135deg, #2a0052 0%, #4a0082 100%);
    padding: 0.5rem;
  }
}
</style>


