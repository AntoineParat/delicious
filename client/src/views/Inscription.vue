<template>
<div>
    <div class="column isCentered">
      <router-link to="/">
        <img src="../assets/resto.png" width="40px" height="40px">
        <span id="delicious">DELICIOUS</span>
      </router-link>
    </div>
    <div class="columns has-text-centered">
      <div class="column is-12">Inscrivez-vous et devenez un membre actif.</div>
    </div>
    <app-inscriptionForm> </app-inscriptionForm>
    </div>
</template>

<script>
import inscriptionForm from "@/components/Inscription-form.vue"
export default {
    name : 'inscriptionForm',
    components : {
        'app-inscriptionForm' : inscriptionForm
    }
}
</script>

<style scoped>

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
