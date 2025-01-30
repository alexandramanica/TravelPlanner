import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import RegisterView from '../views/RegisterView.vue'
import AttractionsView from '../views/AttractionsView.vue'
import RestaurantsView from '@/views/RestaurantsView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import TripsView from '@/views/TripsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'reigster',
    component: RegisterView
  },
  {
    path: '/attractions',
    name: 'attractions',
    component: AttractionsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurants',
    name: 'restaurants',
    component: RestaurantsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'activities',
    component: ActivitiesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/trips',
    name: 'trips',
    component: TripsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    console.warn('User not authenticated')
    next("/login");
  } else {
    next();
  }
});

export default router
