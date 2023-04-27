import { createRouter, createWebHistory } from "vue-router";
import { defineStore } from "pinia"; // import Pinia store
import { supabase } from "../supabase"; // import Supabase configuration
import HomeView from "../views/HomeView.vue";
import EditarView from "../views/EditarView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
//import { useUserStore } from "../stores/user";


// Define a Pinia store for handling user-related state and actions
export const useUserStore = defineStore("user", {
    state: () => ({
        loadingSession: false,
    }),
    actions: {
        async currentUser() {
            // Update this action to fetch current user from Supabase
            const user = supabase.auth.user();
            return user;
        },
    },
});

const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await supabase.userStore.currentUser();
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