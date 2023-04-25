import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

import HomeView from "../views/HomeView.vue";
import EditarView from "../views/EditarView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();
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