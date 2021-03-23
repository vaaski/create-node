import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "home",
    component: () => import("./views/home.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
]

const router = createRouter({
  // @ts-expect-error idk
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
