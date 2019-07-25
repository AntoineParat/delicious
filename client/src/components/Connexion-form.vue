<template>
  <div>
    <div class="isCentered">
      <router-link to="/">
        <img src="../assets/resto.png" width="40px" height="40px" />
        <span id="delicious">DELICIOUS</span>
      </router-link>
    </div>
    <div class="columns has-text-centered">
      <div class="column is-12">Connectez-vous et accédez à votre compte.</div>
    </div>

    <section>
      <form @submit.prevent="validateBeforeSubmit" autocomplete="off">
        <b-field label="Email">
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

        <b-field label="Mot de passe">
          <p class="control has-icon has-icon-right">
            <input
              name="password"
              v-model="password"
              v-validate="'required|min:8'"
              :class="{'input': true, 'is-danger': errors.has('password') }"
              type="password"
              placeholder="Mot de passe"
            />
            <i v-show="errors.has('password')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('password')"
              class="help is-danger"
            >Le mot de passe doit faire 8 caractères minimum</span>
          </p>
        </b-field>

        <div class="justify">
        <button type="submit" class="button is-primary">Se connecter</button>
        <p id="resetLink" @click="reset(true)"> Mot de passe oublié ? </p>
        </div>

      </form>
    </section>
  </div>
</template>

<script>
export default {
    props : ["reset"],
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const formData = {
            email: this.email,
            password: this.password
          };
          this.$store
            .dispatch("login", formData)
            .then(response => this.playSuccess(response))
            .catch(error => {
              this.playError(error);
              this.password = null;
            });
          return;
        }
        this.$toast.open({
          message: "Le formulaire n'est pas valide !",
          type: "is-danger",
          position: "is-bottom"
        });
      });
    },
    playError(val) {
      this.$toast.open({
        message: val,
        type: "is-danger",
        position: "is-bottom",
        duration: 4000
      });
    },
    playSuccess(val) {
      this.$toast.open({
        message: val,
        type: "is-success",
        position: "is-bottom",
        duration: 4000
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
.columns {
  margin: 0 30px 0 30px;
}
.isCentered {
  display: flex;
  align-items: center;
  justify-content: center;
}
#resetLink {
    text-decoration: underline;
    color : #714dd1;
    font-size: 0.9em;
    cursor: pointer;
}
.justify {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
