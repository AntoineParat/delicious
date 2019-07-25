<template>
  <div id="infoProfil">
    <section>
      <div v-if="toChangeMail" class="block" @click="resetMail">
        <span id="delete" class="tag is-danger">
          Annuler
          <button class="delete is-medium"></button>
        </span>
      </div>

      <form @submit.prevent="validateBeforeSubmit" autocomplete="off">
        <b-field v-if="!toChangeMail" label="Email">
          <p class="control has-icon has-icon-right">
            <input
              name="email"
              @click="toChangeMail = !toChangeMail"
              :class="{'input': true }"
              type="text"
              :placeholder="info.email"
            />
          </p>
        </b-field>

        <b-field v-if="toChangeMail" label="Entrez votre nouvelle adresse mail">
          <p class="control has-icon has-icon-right">
            <input
              name="email"
              v-model="newEmail"
              v-validate="'required|email'"
              :class="{'input': true, 'is-danger': errors.has('email') }"
              type="text"
            />
            <i v-show="errors.has('email')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('email')"
              class="help is-danger"
            >Vous devez indiquer un email valide</span>
          </p>
        </b-field>

        <b-field v-if="toChangeMail" label="Mot de passe">
          <p class="control has-icon has-icon-right">
            <input
              name="password"
              v-model="password"
              v-validate="'required|min:8'"
              :class="{'input': true, 'is-danger': errors.has('password') }"
              type="password"
            />
            <i v-show="errors.has('password')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('password')"
              class="help is-danger"
            >Le mot de passe doit faire 8 caractères minimum</span>
          </p>
        </b-field>

        <b-field label="Nom">
          <p class="control has-icon has-icon-right">
            <input
              name="name"
              v-model="username"
              :class="{'input': true}"
              type="text"
              :placeholder="info.name"
            />
          </p>
        </b-field>

        <b-field label="Age">
          <p class="control has-icon has-icon-right">
            <input
              name="age"
              v-model="age"
              v-validate="'min_value:0'"
              :class="{'input': true, 'is-danger': errors.has('age') }"
              type="number"
              :placeholder="info.age"
            />
            <i v-show="errors.has('age')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('age')"
              class="help is-danger"
            >Vous ne pouvez pas avoir moins de 0 an !</span>
          </p>
        </b-field>

        <b-field label="Telephone">
          <p class="control has-icon has-icon-right">
            <input
              name="telephone"
              v-validate="'min:10'"
              v-model="phone"
              :class="{'input': true, 'is-danger': errors.has('telephone') }"
              type="number"
              :placeholder="info.phone"
            />
            <i v-show="errors.has('telephone')" class="fa fa-warning"></i>
            <span
              v-show="errors.has('telephone')"
              class="help is-danger"
            >Votre numéro de téléphone doit comporter 10 chiffres au moins</span>
          </p>
        </b-field>

        <button v-if="hasChanged === true" type="submit" class="button is-primary">Envoyer</button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newEmail: null,
      age: null,
      username: null,
      phone: null,
      password: null,
      toChangeMail: false,
      hasChanged: false
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.post();
          this.toChangeMail ? (this.toChangeMail = false) : "";
          this.password = null;
          return;
        }
        this.username = this.phone = this.age = null;
        this.$toast.open({
          message: "Le formulaire n'est pas valide !",
          type: "is-danger",
          position: "is-bottom"
        });
      });
    },
    resetMail() {
      this.email = this.userEmail;
      this.newEmail = this.password = null;
      this.toChangeMail = false;
    },
    post() {
      const formData = {};
      this.newEmail != null &&
      this.newEmail.length > 0 &&
      this.newEmail != this.info.email
        ? (formData.email = this.newEmail)
        : "";
      this.username != null &&
      this.username != this.info.name &&
      this.username.length > 0
        ? (formData.name = this.username)
        : "";
      this.age != null && this.age.length > 0 && this.age != this.info.age
        ? (formData.age = this.age)
        : "";
      this.phone != null &&
      this.phone.length > 0 &&
      this.phone != this.info.phone
        ? (formData.phone = this.phone)
        : "";
      this.password != null ? (formData.password = this.password) : "";
      this.$store
        .dispatch("patchInfo", formData)
        .then(response => this.playSuccess(response))
        .catch(error => this.playError(error));
    },
    playError(val) {
      this.$toast.open({
          message: val,
          type: "is-danger",
          position: "is-bottom",
          duration : 4000
        });
    },
    playSuccess(val) {
      this.$toast.open({
          message: val,
          type: "is-success",
          position: "is-bottom",
          duration : 4000
        });
    }
  },
  computed: {
    info() {
      return this.$store.getters.userInfo;
    }
  },
  watch: {
    newEmail(value) {
      value ? (this.hasChanged = true) : (this.hasChanged = false);
    },
    username(value) {
      value.length > 0 && value != this.info.name
        ? (this.hasChanged = true)
        : (this.hasChanged = false);
    },
    age(value) {
      value
        ? value > 0
          ? (this.hasChanged = true)
          : (this.hasChanged = false)
        : "";
    },
    phone(value) {
      value
        ? value.length >= 10
          ? (this.hasChanged = true)
          : (this.hasChanged = false)
        : "";
    },
  }
};
</script>

<style scoped>
#newMail .help {
  font-size: 1rem;
}
#delete {
  height: 30px;
}
section {
  width: 60%;
  margin: auto;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
</style>
