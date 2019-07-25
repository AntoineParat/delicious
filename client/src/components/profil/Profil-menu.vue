<template>
  <aside class="menu">
    <p class="menu-label">General</p>
    <ul class="menu-list ">
       <li>
        <a id="firstSelect" href="#infoProfil" @click="isSelected('app-infoForm', $event)">Informations</a>
      </li>
      <li>
        <a href="#photoProfil" @click="isSelected('app-photo-profil', $event)">Photo de profil</a>
      </li>
      <li>
        <a href="#passwordProfil" @click="isSelected('app-new-Password', $event)">Mot de passe</a>
      </li>
    </ul>
    <p class="menu-label">Delicious</p>
    <ul class="menu-list">
      <li>
        <a a href="#restaurantsProfil" @click="isSelected('app-restaurants', $event)">Mes restaurants</a>
      </li>
      <li>
        <a a href="#commentairesProfil" @click="isSelected('app-commentaires', $event)">Commentaires</a>
      </li>
    </ul>
    <p class="menu-label">Mon compte</p>
    <ul class="menu-list">
      <li>
        <a href="#suppProfil" @click="isSelected('app-suppression', $event)">Supprimer mon compte</a>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: ["selectComponent"],
  data() {
    return {
      isActive : []
    };
  },
  methods : {
    isSelected(e, event) {
      this.selectComponent(e);
      for (e of this.isActive) {
        e.style.color = "#333030"
      }
      this.isActive.length = 0;
      this.isActive.push(event.target);
    }
  },
  watch : {
    isActive(val) {
       val[0].style.color ="#714DD2"
    }
  },
  mounted() {
    const a = document.querySelector("#firstSelect").click()
  }
};
</script>

<style>

</style>



