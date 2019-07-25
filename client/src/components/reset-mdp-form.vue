<template>
  <form @submit.prevent="validateBeforeSubmit" autocomplete="off">
    <b-field label="Nouveau mot de passe">
      <p class="control has-icon has-icon-right">
        <input
          name="newPassword"
          v-model="newPassword"
          v-validate="'required|min:8'"
          :class="{'input': true, 'is-danger': errors.has('newPassword') }"
          type="password"
          placeholder="Nouveau mot de passe"
        />
        <i v-show="errors.has('newPassword')" class="fa fa-warning"></i>
        <span
          v-show="errors.has('newPassword')"
          class="help is-danger"
        >Le mot de passe doit faire 8 caractères minimum</span>
      </p>
    </b-field>

    <b-field
      label="Confirmation du mot de passe"
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
        v-validate="{ required: true, is: newPassword }"
      />
    </b-field>

    <button type="submit" class="button is-primary">Envoyer</button>
  </form>
</template>


<script>
import axiosRequest from "../axiosRequest";
export default {
  props: ["setName"],
  data() {
    return {
      newPassword: null, // password
      confirmPassword: null
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.axiosPost();
          return;
        }
        this.$toast.open({
          message: "Le formulaire n'est pas valide !",
          type: "is-danger",
          position: "is-bottom"
        });
      });
    },
    axiosPost() {
      const formData = {
        password: this.newPassword,
        user: this.$route.params.id
      };
      axiosRequest
        .resetPassword(formData)
        .then(response => {
          this.$router.replace("/connexion");
          this.playSuccess(response);
        })
        .catch(error => {
          this.newPassword = this.confirmPassword = null;
          this.playError(error);
        });
    },
    playError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 5000
      });
    },
    playSuccess(success) {
      this.$toast.open({
        message: success,
        type: "is-success",
        position: "is-bottom",
        duration: 5000
      });
    }
  }
};
</script>

<style scoped>
form {
  width: 300px;
  margin: auto;
  margin-top: 50px;
}
</style>