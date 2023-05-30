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
    //name: "dashboard",
    //component: Home,
    name: "login",
    //component: Style,
    component: () => import("@/views/LoginView.vue"),
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
  /*{
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },*/
  {
    meta: {
      title: "Mis Capturas",
    },
    path: "/mis-capturas",
    name: "miscapturas",
    component: () => import("@/views/MisCapturas.vue"),
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

  {
    meta: {
      title: "Capturar",
    },
    path: "/capturar",
    name: "capturar",
    component: () => import("@/views/CapturarView.vue"),
  },

  {
    meta: {
      title: "Todas las Capturas",
      permiso: 3 // permiso solo para jefes de cpr y mkt 
    },
    path: "/capturas",
    name: "capturas",
    component: () => import("@/views/TodasLasCapturas.vue"),
  },

  {
    meta: {
      title: "Detalle de Promoción",
      //permiso: 3 // permiso solo para jefes de cpr y mkt 
    },
    path: "/detalle-prom",
    name: "detalle",
    component: () => import("@/views/DetallePromocion.vue"),
  },

  {
    meta: {
      title: "Editar Promoción",
      //permiso: 3 // permiso solo para jefes de cpr y mkt 
    },
    path: "/editar-prom",
    name: "editar",
    component: () => import("@/views/EditarView.vue"),
  },


  {
    meta: {
      title: "Promociones para autorizar",
      //permiso: 3 // permiso solo para jefes de cpr y mkt 
    },
    path: "/prom-aut",
    name: "prom-autorizar",
    component: () => import("@/views/ParaAutorizar.vue"),
  },

  {
    meta: {
      title: "Autorizar Promoción",
      //permiso: 3 // permiso solo para jefes de cpr y mkt 
    },
    path: "/autorizar",
    name: "autorizar",
    component: () => import("@/views/AutorizarPromocion.vue"),
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
  const user = useMainStore();
  //console.log("next route", to, to.permiso)
  if (to.matched.some((record) => record.meta.notRequiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    //console.log("record no required auth")
    next()
    
  } else {
    //console.log("record si required auth", from)
    //console.log(next)
    if (user.userName == null) {
      //console.log("AL LOGIN")
      next({ name: 'Login' })
    } else {
      //console.log("A LA SIG RUTA",  to.meta.permiso === true)

      if (to.meta.permiso){ 
        //console.log(user)
        //console.log(user.rol)
        //console.log(to,"to", to.name)  
        if(user.rol <= to.meta.permiso){
          //console.log("si tiene permiso", from)  
          next() // go to wherever I'm going
        }else{
          //console.log("sin permiso", from)
          //console.log(user.rol)
          //console.log(to.meta.permiso)
          next(from)
          //return
        }
      }else{
        next()
      }
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
