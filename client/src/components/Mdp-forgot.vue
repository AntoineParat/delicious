<template>
  <div>
    <div class="column isCentered">
      <router-link to="/">
        <img src="../assets/resto.png" width="40px" height="40px" />
        <span id="delicious">DELICIOUS</span>
      </router-link>
    </div>
    <div class="columns has-text-centered">
      <div class="column is-12">Nous allons vous envoyer un email pour réinitialiser votre mot de passe.</div>
    </div>

    <section>
      <form @submit.prevent="validateBeforeSubmit" autocomplete="off">
        <b-field label="Entrez votre adresse email">
          <p class="control has-icon has-icon-right">
            <input
              name="email"
              v-model="email"
              v-validate="'required|email'"
              :class="{'input': true, 'is-danger': errors.has('email') }"
              type="text"
              placeholder="Email"
            />
            <i v-show="errors.has('email')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('email')"
              class="help is-danger"
            >Vous devez entrez un email valide</span>
          </p>
        </b-field>

        

        <button type="submit" class="button is-primary">Envoyer</button>

      </form>
    </section>
  </div>
</template>

<script>
import axiosRequest from "../axiosRequest";
export default {
  data() {
    return {
      email: null,
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
         this.postMail()
          return;
        }
        this.$toast.open({
          message: "Le formulaire n'est pas valide !",
          type: "is-danger",
          position: "is-bottom"
        });
      });
    },
    postMail() {
      axiosRequest.sendResetMail(this.email)
      .then(response => {
        this.playSuccess(response);
        this.email = null;
      })
      .catch(error => {
        this.playError(error)
        this.email = null;
      })
    },
    playError(val) {
      this.$toast.open({
        message: val,
        type: "is-danger",
        position: "is-bottom",
        duration: 5000
      });
    },
    playSuccess(val) {
      this.$toast.open({
        message: val,
        type: "is-success",
        position: "is-bottom",
        duration: 5000
      });
    }
  }
};
</script>

<style scoped>
section {
  width: 300px;
  margin: auto;
  margin-top: 50px;
}
#delicious {
  font-size: 2rem;
  margin-left: 10px;
  color: #714dd1;
}
.column {
  margin-left: 0.75rem;
  margin-right: 0.75rem;
}
.columns {
  margin: 0 30px 0 30px;
}
.isCentered {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
