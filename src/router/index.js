import {createRouter, createWebHistory} from 'vue-router'
import login from "@/views/auth/Login.vue";
import Main from "@/views/main/Main.vue";
import Register from "@/views/auth/Register.vue";
import {useUserStore} from "@/stores/userStore.js";
import Search from "@/views/search/Search.vue";
import Vehicle from "@/views/vehicle/Vehicle.vue";
import VehicleDetails from "@/components/VehicleDetails.vue";
import Profile from "@/views/profile/Profile.vue";
import Chat from "@/views/chat/Chat.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/login',
      name: 'login',
      component:login
    },
    {
      path: '/register',
      name: 'register',
      component:Register
    },
    {
      path:'/search',
      name: 'search',
      component: Search,
      meta: { requiresAuth: true },
    },
    {
      path: '/vehicle',
      name: 'vehicle',
      component: Vehicle,
      meta: { requiresAuth: true },
    },
    {
      path: "/vehicle/:id",
      name: 'vehicleDetails',
      component: VehicleDetails,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: { requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    }
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const userStore = useUserStore();
  if (requiresAuth && !userStore.isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router
