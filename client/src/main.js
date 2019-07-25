import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "buefy/dist/buefy.css";

import Buefy from "buefy"
Vue.use(Buefy);

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
    libraries: "places" // necessary for places input
  }
});

import VeeValidate from "vee-validate";
Vue.use(VeeValidate);

import infiniteScroll from "vue-infinite-scroll";
Vue.use(infiniteScroll);

import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);

import StarRating from 'vue-star-rating';
Vue.component('star-rating', StarRating)


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
