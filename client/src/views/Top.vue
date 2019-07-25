<template>
  <div class="container has-text-centered">
    <app-navbar></app-navbar>
    <div>
      <p>
        <i class="fas fa-crown fa-5x"></i>
      </p>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>N°</th>
          <th>Nom</th>
          <th>Note moyenne</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(store, index) in stores" :key="index">
          <th>{{ index +1 }}</th>
          <td>
            <router-link :to=" '/store/' + store._id "  :title="store.name"> 
              <i class="fas fa-trophy" v-if="index===0"></i> {{ store.name }}
            </router-link>
          </td>
          <td class="has-text-centered">{{store.rank}}</td>
        </tr>

      </tbody>
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
    </table>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axiosRequest from "../axiosRequest";
export default {
  name: "tags",
  components: {
    "app-navbar": Navbar
  },
  data() {
      return {
          stores : [],
          isLoading : false,
      }
  },
  created() {
    this.getRanking();
    // this.getCount();
  },
  methods : {
    getRanking() {
      this.isLoading = true;
      axiosRequest.getRanking()
      .then(response => {
        for (let store of response) {
          this.stores.push(store)
        };
        this.isLoading = false
      })   
      .catch(error => this.isLoading = false)   
    },
  }
};
</script>

<style scoped>
.container {
  margin-top: 80px;
  /* margin-left: 5%;
  margin-right: 5%; */
}
.fa-crown {
  color: #714dd1;
}
table {
  margin: auto;
  margin-top: 35px;
}
</style>
