import { createRouter, createWebHashHistory } from "vue-router";
import homeRoutes from "./home";

const login = () => import("@/pages/login.vue");
const home = () => import("@/pages/home.vue");

const routes = [
  {
    path: "/",
    redirect: "/login",
    component: null,
  },
  {
    path: "/login",
    component: login,
  },
  {
    path: "/home",
    component: home,
    redirect: "/home/view",
    children: homeRoutes,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});
