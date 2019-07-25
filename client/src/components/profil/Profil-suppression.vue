<template>
  <div id="suppProfil">
    <div class="notification is-danger">
     <p> Attention, vous vous apprêtez à supprimer votre compte. </p>
      <p>En cliquant sur "j'ai compris", vous comprenez que
      <strong>cette action est définitive et irréversible</strong>. Vous perdrez l'accès
      à votre espace personnel sur le site, mais tous vos commentaires ainsi que les restaurants ajoutés
      resteront visibles. </p>
      <div class="center">
      <button
        @click="isActiv = !isActiv"
        class="button is-warning"
      >J'ai compris</button>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': isActiv }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Suppression du compte</p>
          <button class="delete" aria-label="close" @click="isActiv = !isActiv"></button>
        </header>
        <section class="modal-card-body">
          <!-- Content ... -->
          <div class="field">
            <label class="label">Entrez votre mot de passe</label>
            <div class="control">
              <input class="input" type="password" placeholder="Mot de passe" v-model="password" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button @click="remove" class="button is-danger">Supprimer mon compte</button>
          <button @click="isActiv = !isActiv" class="button">Annuler</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import axiosRequest from "../../axiosRequest";
export default {
  data() {
    return {
      isActiv: false,
      password: null
    };
  },
  methods: {
    remove() {
      const formData = this.password;
      axiosRequest
        .deleteUser(formData)
        .then(response => {
          this.$store.dispatch("logout");
          this.$router.push(response);
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped>
button {
  margin-top: 20px;
}
.center {
  display: flex;
  justify-content: center;
}
p {
  text-align: justify;
}
</style>
