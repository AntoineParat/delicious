<template>
  <div>
    <app-navbar></app-navbar>
    <div class="container">
      <form @submit.prevent="validateBeforeSubmit" autocomplete="off">
        <section>
          <div class="field">
            <label class="label">Nom du restaurant</label>
            <div class="control">
              <input
                v-model="name"
                class="input"
                type="test"
                placeholder="Entrez le nom du restaurant"
                :class="{'is-danger' : check.nameError}"
                @keyup="check.nameError = false"
              />
              <!-- <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span> -->
            </div>
            <p v-if="check.nameError" class="help is-danger">Entrez un nom</p>
          </div>

          <div class="field">
            <label class="label">Adresse</label>
            <div class="control">
              <gmap-autocomplete
                name="address"
                class="input"
                :class="{'is-danger' : check.addressError}"
                placeholder="Indiquez un lieu"
                autocomplete="off"
                @place_changed="setPlace"
                @keyup="check.addressError = false"
              ></gmap-autocomplete>
            </div>
            <p v-if="check.addressError" class="help is-danger">Entrez une adresse</p>
          </div>

          <!-- DRAG AND DROP -->
          <b-field label="Images (5 photos maximum) ">
            <b-upload v-model="dropFiles" multiple drag-drop accept="image/png, image/jpeg">
              <div class="content has-text-centered">
                <p>
                  <i class="fas fa-upload fa-2x"></i>
                </p>
                <p>Déposez vos photos ici ou cliquez pour télécharger</p>
              </div>
              <p v-if="check.uploadError" class="help is-danger">Téléchargez au moins une photo</p>
            </b-upload>
          </b-field>

          <div class="tags">
            <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
              {{file.name}}
              <button
                class="delete is-small"
                type="button"
                @click="deleteDropFile(index)"
              ></button>
            </span>
          </div>

          <!-- TAGS LIST -->
          <label class="label">Caractéristiques</label>
          <p
            v-if="check.arrayError"
            class="help is-danger"
          >Sélectionner les caractéristiques du restaurant</p>
          <div class="tags">
            <span class="tag" @click="selectTags">Wi-Fi</span>
            <span class="tag" @click="selectTags">Chic</span>
            <span class="tag" @click="selectTags">Convivial</span>
            <span class="tag" @click="selectTags">Romantique</span>
            <span class="tag" @click="selectTags">Vegan</span>
            <span class="tag" @click="selectTags">Branché</span>
            <span class="tag" @click="selectTags">Cuisine à thème</span>
            <span class="tag" @click="selectTags">Gastronomique</span>
          </div>

          <!-- Description -->
          <span v-if="check.descriptionError" class="help is-danger">Entrez une description</span>
          <b-field label ="Description">
              <b-input
                name="description"
                v-model="description"
                maxlength="200"
                type="textarea"
                placeholder="Entrez une description"
                autocomplete="off"
                @keyup="check.descriptionError = false"
              />
          </b-field>

          <button type="submit" class="button is-primary">Envoyer</button>

          <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="true"></b-loading>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axiosRequest from "../axiosRequest";
export default {
  name: "tags",
  components: {
    "app-navbar": Navbar
  },
  data() {
    return {
      adresstest: "",
      name: "",
      dropFiles: [],
      currentPlace: "",
      placeCoordinates: "",
      description: "",
      array: [],
      isClicked: false,
      check: {
        checkOK: false,
        nameError: false,
        addressError: false,
        descriptionError: false,
        arrayError: false,
        uploadError: false
      },
      isLoading: false,
      isFullPage: true,
    };
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    setPlace(place) {
      this.currentPlace = place;
      this.placeCoordinates = {
        lat: this.currentPlace.geometry.location.lat(),
        lng: this.currentPlace.geometry.location.lng()
      };
      // console.log(this.currentPlace.formatted_address);
      // console.log(this.placeCoordinates.lat, this.placeCoordinates.lng);
    },
    validateBeforeSubmit() {
      this.name.length < 1
        ? (this.check.nameError = true)
        : (this.check.nameError = false);
      this.placeCoordinates.length < 1
        ? (this.check.addressError = true)
        : (this.check.addressError = false);
      this.description.length < 1
        ? (this.check.descriptionError = true)
        : (this.check.descriptionError = false);
      this.array.length < 1
        ? (this.check.arrayError = true)
        : (this.check.arrayError = false);
      this.dropFiles.length < 1
        ? (this.check.uploadError = true)
        : (this.check.uploadError = false);
      if (
        this.check.nameError === false &&
        this.check.addressError === false &&
        this.check.descriptionError === false &&
        this.check.arrayError === false &&
        this.check.uploadError === false
      ) {
        this.axiosPost();
        this.isLoading = true;
      } else {
        this.validationError();
      }
    },
    axiosPost() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const minutes = String(today.getMinutes()).padStart(2, "0");

      const data = {
        name: this.name,
        adresse: this.currentPlace.formatted_address,
        lat : this.placeCoordinates.lat,
        lng : this.placeCoordinates.lng,
        description: this.description,
        date: `${dd}/${mm}/${yyyy}, à ${today.getHours()}h${minutes}`
      };
      
      const formData = new FormData();
      for (let image of this.dropFiles) {
        formData.append("photos", image);
      }
      for (let key in data) {
        formData.append(key, data[key]);
      }
      for (let tag of this.array) {
        formData.append("tags", tag)
      }

      axiosRequest
        .addStore(formData)
        .then(response => {
          this.isLoading = false;
          this.displaySuccess(response);
          this.name = this.currentPlace = this.description = this.array = this.dropFiles =
            "";
          this.$store.state.stores.length = 0;
          this.$router.push('/');
        })
        .catch(error => {
          this.isLoading = false;
          this.displayError(error);
        });
    },
    displaySuccess(response) {
      this.$toast.open({
        message: response,
        type: "is-success",
        position: "is-bottom",
        duration: 4000
      });
    },
    displayError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 4000
      });
    },
    validationError() {
      this.$toast.open({
        duration: 5000,
        message: `Veuillez vérifier les champs manquants`,
        position: "is-bottom",
        type: "is-danger",
        duration: 4000
      });
    },
    selectTags(e) {
      e.target.classList.toggle("is-success");
      this.check.arrayError = false;
      let tag = "";
      e.target.textContent
        ? (tag = e.target.textContent)
        : (tag = e.target.nextSibling.nextElementSibling.textContent);
      this.array.includes(tag)
        ? this.array.splice(this.array.indexOf(tag), 1)
        : this.array.push(tag);
    }
  }
};
</script>

<style scoped>
@media(max-width: 768px) {
  section {
  width: 80%;
  margin: auto;
  }
}
@media(min-width: 769px) {
  section {
  width: 55%;
  margin: auto;
  }
}
@media(min-width: 1216px) {
  section {
  width: 40%;
  margin: auto;
  }
}
.container {
  margin-top: 80px;
  margin-left: 5%;
  margin-right: 5%;
}
#dropFile {
  width: 100%;
}
.tag {
  cursor: default;
}
</style>
