<template>
  <div>
    <app-connexion :reset="reset" v-if="!resetMdp"> </app-connexion>
    <app-reset v-if="resetMdp"> </app-reset>
  </div>
</template>

<script>
import connexForm from "@/components/Connexion-form";
import mdpReset from "@/components/Mdp-forgot";
export default {
  components : {
    "app-connexion" : connexForm,
    "app-reset" : mdpReset
  },
  data() {
    return {
      resetMdp : false
    };
  },
  methods: {
    reset(element) {
      this.resetMdp = element
    }
  }
};
</script>


