import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import store from "./store";


Vue.use(Router);

export default new Router({
  mode: "history",
   base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path : "/inscription",
      name : "inscription",
      component :() => import("./views/Inscription.vue")
    },
    {
      path : "/connexion",
      name : "connexion",
      component :() => import("./views/Connexion.vue")
    },
    {
      path : "/top",
      name : "top",
      component :() => import("./views/Top.vue")
    },
    {
      path : "/ajouter",
      name : "ajouter",
      component :() => import("./views/Ajouter.vue"), beforeEnter: (to, from, next) => {
        if (store.state.isConnected) {
          next()
        } else {
          next('/connexion')
        }
      }
    },
    {
      path : "/carte",
      name : "carte",
      component :() => import("./views/Carte.vue")
    },
     {
      path : "/profil",
      name : "profil",
      component :() => import("./views/Profil.vue")
    },
    {
      path : "/store/:id",
      name : "profil",
      component :() => import("./views/Store.vue")
    },
    {
      path : "/test",
      name : "test",
      component :() => import("./views/Test.vue")
    },
    { path: '*', 
      name : "redirect",
      redirect: '/' 
    },
    {
      path : "/reset-password/:id",
      name : "reset-password",
      component :() => import("./views/Reset-mdp")
    },  
]
});
