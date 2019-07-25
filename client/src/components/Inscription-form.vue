<template>
  <div>
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
            >Vous devez indiquer un email valide</span>
          </p>
        </b-field>

        <b-field label="Nom">
          <p class="control has-icon has-icon-right">
            <input
              name="name"
              v-model="username"
              v-validate="'required'"
              :class="{'input': true, 'is-danger': errors.has('name') }"
              placeholder="Nom d'utilisateur"
            />
            <i v-show="errors.has('name')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('name')"
              class="help is-danger"
            >Vous devez entrez un nom d'utilisateur</span>
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

        <b-field
          label="Confirmation"
          :type="{'is-danger': errors.has('confirm-password')}"
          :message="[{
                    'Vous devez confirmer le mot de passe' : errors.firstByRule('confirm-password', 'required'),
                    'Le mot de passe n\'est pas identique'  : errors.firstByRule('confirm-password', 'is')
                }]"
        >
          <b-input
            type="password"
            placeholder="Confirmation mot de passe"
            v-model="confirmPassword"
            name="confirm-password"
            v-validate="{ required: true, is: password }"
          />
        </b-field>

        <button type="submit" class="button is-primary">S'inscrire</button>

      </form>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: null,
      age: null,
      username: null,
      password: null,
      confirmPassword: null
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const formData = {
            email: this.email,
            name: this.username,
            password: this.password
          };
          this.$store
            .dispatch("signup", formData)
            .then(response => {
              this.displaySuccess(response);
              this.password = this.confirmPassword = this.email = null;
              this.$router.replace('/')
            })
            .catch(error => {
              this.displayError(error);
              this.error = error;
              this.alert = true;
              this.password = this.confirmPassword = this.email = this.username = null;
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
    displayError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 5000
      });
    },
    displaySuccess(response) {
      this.$toast.open({
        message: response,
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
</style>
