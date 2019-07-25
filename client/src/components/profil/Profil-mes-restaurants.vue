<template>
  <div id="restaurantsProfil">
    <div class="notification is-warning has-text-centered" v-if="isEmpty">
      <strong>{{isEmptyMsg}}</strong>
    </div>
    <div class="card" v-for="(store, index) in stores" :key="index">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-96x96">
              <img :src=" '/api/store/avatar/' + store._id + '/' + store.photos[0].name " alt="Placeholder image" />
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{ store.name }}</p>
          </div>
        </div>

        <div class="content">
          Ajouté le :
          <time>{{store.date}}</time>
          <br />
          Description: {{ store.description }}
          <br />
          Note moyenne : {{ store.rank }}
          <br />
          <router-link id="link" :to=" '/store/' + store._id " tag="button" class="button is-primary" >
          Voir le restaurant
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-infinite-scroll="getStores"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="0"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500"
    ></div>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
    <app-back-to-top> </app-back-to-top>
  </div>
</template>

<script>
import axiosRequest from "../../axiosRequest";
import BackToTop from "../Back-to-top";
export default {
  components : {
    "app-back-to-top" : BackToTop
  },
  data() {
    return {
      isLoading: false,
      busy: false,
      stores : [],
      page : 1,
      isEmpty : false,
      isEmptyMsg : null
    };
  },
  created() {
    this.getStores()
  },
  methods : {
    getStores() {
      this.isLoading = true;
      this.busy = true
      axiosRequest.userStores(this.page)
      .then(response => {
        for (let store of response) {
          this.stores.push(store)
        };
        this.isLoading = false;
        this.isEmpty = false;
        this.page += 1;
        this.busy = false;
      })
      .catch(error => {
        console.log(error)
        this.isLoading = false;
        this.isEmpty = true;
        this.isEmptyMsg = error;
        this.busy = false;
      })
    }
  },
};
</script>

<style scoped>
#link {
  text-decoration: none;
}
.button {
  margin-top: 20px;
}
.card {
  margin-left: 5%;
  margin-right: 5%;
}
</style>
