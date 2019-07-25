<template>
  <div>
    <ul id="storeDemo" class="columns">
      <div class="column is-one-third" v-for="(store, index) in stores" :key="index">
        <div class="card">
          <router-link tag="div" class="card-image" :to=" '/store/' + store._id ">
            <figure class="image is-5by4">
              <img
                :src=" '/api/store/avatar/' + store._id + '/' + store.photos[0].name"
                alt="Placeholder image"
              />
            </figure>
          </router-link>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <star-rating :star-size="15" :show-rating="false" :rating="store.rank" :increment="0.1" > </star-rating>
                <p class="title is-4" style="text-transform : uppercase">{{store.name}}</p>
                <p class="subtitle is-6">
                  <span
                    id="card-tag"
                    class="tag is-light"
                    v-for="(tag, index) in store.tags"
                    :key="index"
                  >{{tag}}</span>
                </p>
              </div>
            </div>

            <div class="content">
              {{store.description.substring(0,40)+"..."}}
              <br />
              <router-link tag="div" :to=" '/store/' + store._id " class="has-text-centered">
                <button class="button is-primary">Voir le restaurant</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </ul>

    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="0"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500"
    >
    </div>

    <app-back-to-top> </app-back-to-top>

    <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
import BackToTop from "../components/Back-to-top";
export default {
  components : {
    "app-back-to-top" : BackToTop
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      busy: false,
    };
  },
 mounted() {
    if (this.stores.length === 0)  {
      this.busy= true;
      this.$store.state.page = 1;
      this.getData(1);
    } 
  },
  methods: {
    getData(page) {
      this.isLoading = true;
      this.$store
        .dispatch("storeInfo", page)
        .then(() => {
          this.$store.commit("page");
          this.busy = false;
          this.isLoading = false;
        })
        .catch(error => {
          this.displayError(error);
          this.isLoading = false;
          this.busy = false;
        });
    },
    displayError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 4000
      });
    },
    loadMore() {
      this.busy = true;
      this.getData(this.page);
    }
  },
  computed: {
    stores() {
      return this.$store.getters.stores;
    },
    reloadStores() {
      return this.$store.state.reloadStores;
    },
    page() {
      return this.$store.state.page;
    }
  }
};
</script>

<style scoped>
#storeDemo {
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
}
#pagination {
  width: 80%;
  margin: auto;
}
#card-tag {
  margin-right: 5px;
  margin-top: 3px;
}
.card-image {
  padding: 30px;
}
img {
  cursor: pointer;
}
.button {
  margin-top: 30px;
}
.card {
  box-shadow: black;
  height: 100%;
}
</style>
