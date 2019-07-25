<template>
  <div>
    <div class="navbar-item has-dropdown" :class="{'is-hoverable' : this.$route.path==='/'}">
      <router-link to="/" class="navbar-link">Restaurants</router-link>
      <div class="navbar-dropdown">
        <p class="navbar-item">Sélectionnez un ou plusieurs critères</p>
        <hr class="navbar-divider" />
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Wi-Fi</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Chic</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Convivial</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Gastronomique</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Vegan</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Branché</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Romantique</b-switch>
          </span>
        </div>
        <div class="navbar-item">
          <span @click="selectTags">
            <b-switch>Cuisine à thème</b-switch>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosRequest from "../axiosRequest";
export default {
  data() {
    return {
      page: 1,
    };
  },
  methods: {
    selectTags(e) {
      if(this.$route.path != "/") {
        return
      }
      let tag = "";
      e.target.textContent
        ? (tag = e.target.textContent)
        : (tag = e.target.nextSibling.nextElementSibling.textContent);
      this.$store.state.tags.includes(tag)
        ? this.$store.state.tags.splice(this.$store.state.tags.indexOf(tag), 1)
        : this.$store.state.tags.push(tag);

    },
    getTags() {
      console.log("send api");
      this.$store.dispatch('getTags', this.tags )
    }
  },
  computed: {
    tags() {
      return this.$store.getters.tags;
    }
  },
  watch: {
    tags() {
      this.getTags();
    }
  }
};
</script>


<style scoped>
ul {
  margin: auto;
}
li {
  list-style: none;
}
.field {
  margin-top: 25px;
}
</style>
