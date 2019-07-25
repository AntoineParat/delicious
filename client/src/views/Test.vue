<template>
  <section class="container">
    <p>{{get}}</p>
    <b-pagination
      :total="total"
      :current.sync="current"
      :order="order"
      :size="size"
      :simple="isSimple"
      :rounded="isRounded"
      :per-page="perPage"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    ></b-pagination>
    {{ current }}
    <hr />

    <button class="button is-info" @click="api">test get request</button>
    <button class="button is-info" @click="test">test 2</button>
    <p>{{ axios }}</p>

    <!-- <div class="has-text-centered">
        <b-dropdown hoverable aria-role="list">
            <p class="menu-label button" slot="trigger">
                <span>Filtrer les restaurants par tags</span>
                <b-icon icon="menu-down"></b-icon>
            </p>

            <b-dropdown-item aria-role="listitem">
                <span @click="selectTags">
                  <b-switch :value="false">Wi-Fi</b-switch>
                </span>
            </b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
        </b-dropdown>
    </div>-->
    <button class="button" @click="test">infiTest</button>

    <div class="box custom has-text-centered">
      <p>Photo de profil :</p>
      <figure class="image is-128x128 is-horizontal-center">
        <img class="is-rounded" src="/api/user/avatar" title="Mon compte" />
      </figure>
      <button class="button" @click="server"> axios test </button>
    </div>
  </section>
</template>

<script>
 import axios from "axios";
// import axiosRequest from "../axiosRequest";
export default {
  data() {
    return {
      total: 200,
      current: 1,
      perPage: 20,
      order: "is-centered",
      size: "",
      isSimple: false,
      isRounded: false,
      axios: "",
      get: null
    };
  },
  methods: {
    api() {
      fetch("api/store/search/info/5d2afa05e9513f079d0deea7")
        .then(resp => resp.json())
        .then(respParsed => {
          console.log(respParsed);
          this.get = respParsed;
        })
        .catch(err => console.log(err))
    },
    test() {
      axios.get("api/store/search/info/5d2afa05e9513f079d0deea7")
      .then(response => {
        console.log(response.data);
        this.axios = response.data
        })
        .catch(error => console.log(error))
    },
    server() {
      axios.get('/api/store/blague')
      .then(response => console.log(response.data.success))
    }
  }
};
</script>

<style scoped>
.pagination-next {
  display: none;
}
</style>
