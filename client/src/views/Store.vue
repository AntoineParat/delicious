<template>
  <div class="container">
    <app-navbar></app-navbar>
    <div id="main" class="columns">
      <div id="restaurant" class="column is-one-third has-text-centered">
        <div class="box">
          <h1 class="title" style="text-transform : uppercase">{{store.name}}</h1>
          <carousel
            :per-page="1"
            :mouse-drag="true"
            paginationPosition="bottom-overlay"
            paginationActiveColor="#a98cf7"
            paginationColor="#f2f2f2"
            navigationEnabled="true"
          >
            <slide v-for="(photo, index) in store.photos" :key="index">
              <img :src=" '/api/store/avatar/' + store._id + '/' + photo.name" width="312" />
            </slide>
          </carousel>
          <!-- DESCRIPTION -->
          <div id="restoInfo">
            <p>
              <i class="fa fa-map-marker-alt" aria-hidden="true"></i>
              {{store.adresse}}
            </p>
            <p id="note">
            <star-rating :rating="store.rank" :read-only="true" :increment="0.1" :star-size="20" ></star-rating>
            </p>
            <div>
              <span
                id="card-tag"
                class="tag is-light"
                v-for="(tag, index) in store.tags"
                :key="index"
              >{{tag}}</span>
            </div>
            <div id="description">
              <p>{{store.description}}</p>
            </div>
          </div>
        </div>
      </div>

      <!--il n'y a qu'un seul restaurant et la carte est centré sur lui -->
      <div id="map" class="column">
        <gmap-map  :center="map" :zoom="14" style="width:100%;  height: 40vh;">
        <gmap-marker
          :key="index"
          :position="map"    
        ></gmap-marker>
        </gmap-map>
      </div>
    </div> 

    <!-- COMMENTAIRES -->
    <app-commentaires :store="store"> </app-commentaires>

    <!-- LOADER -->
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>


<script>
import navBar from "@/components/Navbar.vue";
import { Carousel, Slide } from "vue-carousel";
import axiosRequest from "../axiosRequest";
import StoreComments from "../components/Store-commentaires";
export default {
  components: {
    "app-navbar": navBar,
    "app-commentaires" : StoreComments,
    Carousel,
    Slide
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      store: null,
    };
  },
  created() {
    const find = this.$store.getters.stores.find(
      e => e._id === this.$route.params.id
    );
    if (find) {
      this.store = find;
    } else {
      this.getSearchStore();
    };
  },
  methods: {
    getSearchStore() {
      this.isLoading = true;
      axiosRequest.getSearchStore(this.$route.params.id)
      .then(response => {
        this.store = response;
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.displayError(error)
        })
    },
    displayError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 4000
      });
    }
  },
  computed: {
    map() {
      return {
        lat : Number(this.store.lat),
        lng : Number(this.store.lng)
      } 
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 100px;
}
#description {
  margin-top: 10px;
}
#note {
  margin-bottom: 7px;
  display: flex;
  justify-content: center;
}
#card-tag {
  margin-right: 5px;
  margin-top: 3px;
}
</style>
