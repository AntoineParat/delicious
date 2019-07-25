<template>
  <div >
    <div class="notification is-warning has-text-centered" v-if="isEmpty===true">
     <i class="far fa-frown fa-5x"></i>  
     <strong id="alert">Aucun restaurant ne correspond à vos critères de recherches !</strong>
    </div>
    <ul id="storeDemo" class="columns">
      <div class="column is-one-third" v-for="(store, index) in storesByTags" :key="index">
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

    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isEmpty : false,
      busy: false,
    };
  },
  methods: {
    loadMore() {
      this.$store.dispatch('pushStoresByTags', {page : this.page +1, tags : this.tags})
    },
  },
  computed: {
    storesByTags() {
      return this.$store.getters.storesByTags;
    },
    isLoading() {
      return this.$store.getters.tagsIsloading;
    },
    tags() {
      return this.$store.getters.tags;
    },
    page() {
      return this.$store.getters.tagSelectorPage;
    }
  },
  watch : {
    storesByTags(val) {
      if(val.length === 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    },
    tags() {
      this.getTags();
    }
  },
};
</script>

<style scoped>
.notification {
  display: flex;
  justify-content: center;
  align-items: center;
}
#alert {
  margin-left: 15px;
}
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
