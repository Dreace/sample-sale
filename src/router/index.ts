import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Empty from "../components/Empty.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/supplier",
    component: Empty,
    children: [
      {
        path: "stock",
        component: () => import("../views/supplier/Stock.vue")
      },
      {
        path: "trade",
        component: () => import("../views/supplier/Trade.vue")
      }
    ]
  },
  {
    path: "/customer",
    component: Empty,
    children: [
      {
        path: "productinfo",
        component: () => import("../views/customer/productinfo.vue")
      },
      {
        path: "tradeInfo",
        component: () => import("../views/customer/tradeInfo.vue")
      },
      {
        path: "/agent",
        component: Empty,
        children: [
          {
            path: "purchase",
            component: () => import("@/views/agent/Purchase.vue")
          }
        ]
      },
      {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/About.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
