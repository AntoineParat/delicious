<template>
    <div>
    <div class="isCentered">
      <router-link to="/">
        <img src="../assets/resto.png" width="40px" height="40px" />
        <span id="delicious">DELICIOUS</span>
      </router-link>
    </div>
    <div class="columns has-text-centered">
      <div class="column is-12">Bonjour {{username}}, renseignez votre nouveau mot de passe.</div>
    </div>

    <app-password-form v-if="!isNotValid"> </app-password-form>
    <div class="notification is-danger has-text-centered" v-if="isNotValid">
      <strong>{{errorMsg}}</strong>
    </div>

    </div>
</template>

<script>
import password from "@/components/reset-mdp-form.vue";
 import axiosRequest from "../axiosRequest";
export default {
    components : {
        "app-password-form" : password
    },
    data() {
        return {
            username : null,
            isNotValid : false,
            errorMsg : null
        }
    },
     created() {
      axiosRequest.getName(this.$route.params.id)
      .then(response => this.username = response)
      .catch(error => {
          this.isNotValid = true;
          this.errorMsg = error
      })
  },
    }

</script>

<style scoped>
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
.notification {
    width: 300px;
    margin: auto;
    margin-top : 30px;
}
</style>
