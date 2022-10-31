//import { createRouter, createWebHashHistory } from "vue-router";
import { createRouter, createWebHistory } from 'vue-router'
//import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";
import { useMainStore } from "@/stores/main.js";

const routes = [
  {
    meta: {
      title: "Select style",
    },
    path: "/",
    name: "dashboard",
    component: Home,
    //name: "login",
    //component: Style,
    //component: () => import("@/views/LoginView.vue"),
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/dashboard",
    name: "style",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Login",
      notRequiresAuth: true
    },
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
];

const router = createRouter({
  //history: createWebHashHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.notRequiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    next()
    
  } else {
    if (useMainStore.userName == null) {
      //next({ name: 'Login' })
      return '/login';
    } else {
      next() // go to wherever I'm going
    }
  }

});

/*router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return '/login';
  }
});*/



export default router;
