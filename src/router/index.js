/*import { createRouter, createWebHistory } from "vue-router";
import AuthView from "../views/AuthView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  {
    path: "/auth",
    component: AuthView,
    children: [
      { path: "login", component: LoginView },
      { path: "sign-up", component: RegisterView },
    ],
  },
  {
    path: "/",
    component: HomeView,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;*/

import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

import HomeView from "../views/HomeView.vue";
import EditarView from "../views/EditarView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import { supabase } from "../supabase";


const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await supabase.userStore.fetchUser() //fetchUser()
    if (user) {
        next();
    } else {
        next("/login");
    }
    userStore.loadingSession = false;
};

const routes = [
    { path: "/", component: HomeView, beforeEnter: requireAuth, name: "home" },
    {
        path: "/editar/:id",
        component: EditarView,
        beforeEnter: requireAuth,
        name: "editar",
    },
    { path: "/login", component: LoginView, name: "login" },
    { path: "/register", component: RegisterView, name: "register" },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;