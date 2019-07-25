<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    const check = document.cookie.match('(^|;) ?' + 'token' + '=([^;]*)(;|$)');
    const token = check ? check[2] : null;
    if (token) {
      this.$store.commit('isConnected')
      this.$store.dispatch('getInfo')
    } 
  },
  mounted() {
    const cookies = localStorage.getItem('cookies')
    if (!cookies) {
      this.$snackbar.open({
        message:
          "Pour assurer une bonne expérience de navigation, ce site utilise des cookies.",
        type: "is-warning",
        position: "is-bottom",
        actionText: "J'ai compris",
        indefinite: true,
        onAction: () => {
          localStorage.setItem('cookies', "ok")
          this.$toast.open({
            message: "Préférences enregistrées",
            queue: false
          });
        }
      });
    }
  }
};
</script>


<style>
</style>
