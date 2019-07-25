<template>
  <div id="photoProfil">
    <div class="box custom has-text-centered">
      <p>Photo de profil :</p>
      <figure class="image is-128x128 is-horizontal-center" :key="componentKey">
        <img class="is-rounded" src="/api/user/avatar"  title="Mon compte" />
      </figure>
    </div>

    <!-- DRAG AND DROP -->

    <b-field id="upload" class="has-text-centered">
      <div class="has-text-centered">
        <b-upload v-model="file" accept="image/jpeg, image/png">
          <a class="button is-primary">
            <i class="fas fa-upload"></i>
            <span>Cliquez pour téléharger</span>
          </a>
        </b-upload>
        <span id="file" class="tag" v-if="file">
          {{ file.name }}
          <button @click="file = '' " class="delete is-small"></button>
        </span>
      </div>
    </b-field>

    <div class="has-text-centered" v-if="!selected">
      <button @click="deleteAvatar" class="button is-danger">Supprimer ma photo de profil</button>
    </div>
    <div class="has-text-centered" v-if="selected" @click="axiosPost">
      <button class="button is-primary">Envoyer</button>
    </div>
   
  </div>
</template>

<script>
import axiosRequest from "../../axiosRequest";
export default {
  name: "photoProfil",
  data() {
    return {
      file: null,
      selected: false,
    };
  },
  methods: {
    axiosPost() {
      const formData = new FormData();
      formData.append('avatar', this.file);
      axiosRequest
        .postAvatar(formData)
        .then(response => {
          this.$store.state.avatarKey += 1;
          this.playSuccess(response);
          this.file = null;
        })
        .catch(error => {
          this.playError(error);
        });
    },
    deleteAvatar() {
      axiosRequest
      .patchDeleteAvatar()
      .then(response => {
        this.$store.state.avatarKey += 1;
        this.playSuccess(response);
        })
      .catch(error => this.playError(error))
    },
    playError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 4000
      });
    },
    playSuccess(success) {
      this.$toast.open({
        message: success,
        type: "is-success",
        position: "is-bottom",
        duration: 4000
      });
    }
  },
  computed : {
    componentKey() {
      return this.$store.state.avatarKey
    } 
  },
  watch: {
    file() {
      this.selected = !this.selected;
    }
  }
};
</script>

<style scoped>
.box .custom {
  width: 70%;
  margin: auto;
  margin-bottom: 40px;
}
#file {
  padding: 15px;
}
#upload {
  margin-bottom: 35px;
}
.fa-upload {
  margin-right: 10px;
}
.is-horizontal-center {
  margin-left: auto;
  margin-right: auto;
}
</style>
