<template>
  <div>
    <app-navbar></app-navbar>
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-4">
          <article class="tile is-child notification is-ligth">
            <p class="title">Profil</p>
            <div class="content">
              <!-- Content -->
              <app-menu :selectComponent="selectComponent"> </app-menu>
            </div>
          </article>
        </div>

        <div class="tile is-parent">
          <article class="box tile is-child notification">
            <div class="content">
              <p class="subtitle"></p>
              <div class="content">
                <!-- Content -->
                <component :is="selectedComponent"> </component>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import menu from "@/components/profil/Profil-menu.vue";
import infoForm from "@/components/profil/Profil-informations-form";
import resetpassword from "@/components/profil/Profil-new-password";
import photoProfil from "@/components/profil/Profil-photo-de-profil";
import suppresion from "@/components/profil/Profil-suppression";
import mesRestaurants from "@/components/profil/Profil-mes-restaurants";
import commentaires from "@/components/profil/Profil-commentaires";
export default {
  name: "home",
  components: {
    "app-navbar": Navbar,
    "app-menu" : menu,
    "app-infoForm" : infoForm,
    "app-new-Password" : resetpassword,
    "app-photo-profil" : photoProfil,
    "app-suppression" : suppresion,
    "app-restaurants" : mesRestaurants,
    "app-commentaires" : commentaires,
  },
  data () {
    return {
      selectedComponent : 'app-infoForm',
    }
  },
  methods : {
    selectComponent(e) {
      this.selectedComponent = e;
    }
  },
};
</script>

<style scoped>
.container {
  margin-top: 80px;
  margin-left: 5%;
  margin-right: 5%;
}
.box {
  background-color : white;
}
</style>
