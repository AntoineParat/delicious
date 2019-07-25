<template>
  <div>
    <nav
      class="navbar is-transparent is-fixed-top has-shadow is-spaced"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="../assets/resto.png" />
        </router-link>
        <router-link class="navbar-item" to="/">
          <p id="name">DELICIOUS</p>
        </router-link>
        <a
          role="button"
          class="navbar-burger burger"
          @click="isActive = !isActive"
          :class="{ 'is-active': isActive }"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu"
        :class="{ 'is-active': isActive, 'animated fadeIn': isActive }"
      >
        <div class="navbar-start">
          <!-- <router-link to="/" class="navbar-item">Restaurants</router-link> -->
          <app-tags-selector> </app-tags-selector>
          <router-link to="/top" class="navbar-item">
            <i class="fas fa-crown"></i>Top
          </router-link>
          <router-link to="/ajouter" class="navbar-item">Ajouter</router-link>
          <router-link to="/carte" class="navbar-item">Carte</router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item" id="searchBox">
            <app-autocomplete></app-autocomplete>
          </div>

          <b-tooltip v-if="isConnected" label="Cliquez pour ouvrir le menu" position="is-left">
            <router-link to="/profil" tag="div">
              <figure class="image is-64x64" :key="componentKey">
                <img
                class="is-rounded click"
                  src="/api/user/avatar"
                />
              </figure>
            </router-link>
          </b-tooltip>
    
          <div class="navbar-item">
            <div class="buttons">
              <router-link v-if="!isConnected" to="/connexion" class="button is-light">Connexion</router-link>
              <router-link
                v-if="!isConnected"
                to="/inscription"
                class="button is-primary"
              >S'inscrire</router-link>
              <router-link
                tag="a"
                v-if="isConnected"
                to="/"
                @click.native="logout"
                class="button is-primary"
              >Déconnexion</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Autocomplete from "@/components/Autocomplete.vue";
import tagsSelector from "@/components/TagsSelector.vue";

export default {
  name: "Navbar",
  components: {
    "app-autocomplete": Autocomplete,
    "app-tags-selector" :tagsSelector
  },
  data() {
    return {
      isActive: false,
      mouveOverAvatar: false,
      showRestaurant : true,
    };
  },
  computed : {
    isConnected() {
      return this.$store.getters.isConnected
    },
    componentKey() {
      return this.$store.state.avatarKey
    },
  },
  methods : {
   logout() {
     this.$store.dispatch('logout')
    },
  },
  // watch : {
  //   tags(val) {
  //     if(val.length > 0) {
  //       this.showRestaurant = false
  //     } else {
  //       this.showRestaurant = true
  //     }
  //   }
  // }
};
</script>

<style scoped>
.navbar-start a:hover {
  color: #714dd1;
}
#name {
  font-size: 2rem;
  color: #714dd1;
  font-weight: 500;
}
.navbar-burger {
  margin-top: 8px;
}
.buttons a {
  font-size: 15px;
}
.fa-crown {
  color: #714dd1;
  margin-right: 5px;
}
.dropdown-content p {
  color: black;
  font-size: 1.1em;
}
.dropdown-content:hover {
  background-color: rgb(249, 247, 247);
}
.click {
  cursor: pointer;
}
</style>
