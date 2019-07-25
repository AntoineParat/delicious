<template>
  <div id="commentairesProfil">
    <div class="notification is-warning has-text-centered" v-if="isEmpty">
      <strong>{{errorMessage}}</strong>
    </div>
    <div class="box">
      {{comments.length}} / {{count}} commentaire<span v-if="comments.length > 1">s</span>
    </div>
    <div class="card" v-for="(comment, index) in comments" :key="index">
      <div class="card-content">
        <p class="title">{{comment.restaurantName}}</p>
        <p class="content">
          Ajouté le 
          <time>{{comment.date}}</time>
        </p>
        <p>
          <star-rating
            v-if="textArea != comment._id"
            :star-size="20"
            :read-only="true"
            :increment="0.1"
            :rating="comment.rank"
            :show-rating="false"
          ></star-rating>
        </p>
        <p v-if="textArea != comment._id" class="content">{{comment.commentaire}}</p>
        <!-- patch commentaire -->
          <star-rating
            v-if="textArea === comment._id"
            :star-size="20"
            v-model="stars"
            v-validate="'required'"
            name="star"
          ></star-rating>
          <span style="color: red" v-if="error">Vous devez donner une note</span>
          <b-field
            v-if="textArea === comment._id"
            :type="{'is-danger': errors.has('patchComment')}"
          >
            <b-input
              maxlength="200"
              type="textarea"
              name="patchComment"
              v-model="pacthComment"
              v-validate="'required'"
            ></b-input>
          </b-field>

        <p class="subtitle">{{comment.userName}}</p>
      </div>
      <footer class="card-footer">
        <p class="card-footer-item">
          <span>
            <button
              id="modifier"
              class="button is-warning"
              v-if="textArea != comment._id"
              @click="textArea = comment._id"
            >Modifier</button>
            <button
              id="modifier"
              class="button is-warning"
              v-if="textArea === comment._id"
              @click="textArea = null"
            >Annuler</button>
            <button
              id="modifier"
              class="button is-primary"
              v-if="textArea === comment._id"
              @click="validateBeforeSubmit"
            >Envoyer</button>
            <router-link
            v-if="textArea != comment._id"
              :to=" '/store/' + comment.restaurantId "
              tag="button"
              class="button is-primary"
            >Voir la page</router-link>
          </span>
        </p>
      </footer>
    </div>

    <div
      v-infinite-scroll="getComments"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="0"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500"
    ></div>
    <app-back-to-top> </app-back-to-top>
  </div>
</template>

<script>
import BackToTop from "../Back-to-top";
import axiosRequest from "../../axiosRequest";
export default {
  components : {
    "app-back-to-top" : BackToTop
  },
  data() {
    return {
      textArea: null, // reçoit l'ID du commentaire à modifier
      pacthComment: null,
      comments: [],
      errorMessage: null,
      isEmpty: false,
      page: 1,
      busy: false,
      count: null,
      stars: null,
      error: false
    };
  },
  created() {
    this.getComments();
  },
  methods: {
    getComments() {
      this.busy = true;
      axiosRequest
        .getUserComments(this.page)
        .then(response => {
          for (let comment of response.success) {
            this.comments.push(comment);
          }
          this.count = response.count;
          this.isEmpty = false;
          this.page += 1;
          this.busy = false;
        })
        .catch(error => {
          this.errorMessage = error;
          this.isEmpty = true
          this.busy = false;
        });
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.error = false;
          this.updateComment();
          return;
        }
        this.error = true;
        this.displayError("Veuillez remplir tous les champs du formulaire");
      });
    },
    updateComment() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const minutes = String(today.getMinutes()).padStart(2, "0");

      const formData = {
        rank: this.stars,
        commentaire: this.pacthComment,
        date : `${dd}/${mm}/${yyyy}, à ${today.getHours()}h${minutes}`,
      };
      axiosRequest.patchComment(this.textArea, formData)
      .then(response => {
        this.displaySuccess(response.success);

        // Le commentaire est modifié sur la page actuelle
        const localComment = this.comments.find(element => element._id === this.textArea);
        for ( let [key, value] of Object.entries(formData)) {
          localComment[key] = value
        }

        //Le commentaire doit ensuite être actualisé dans le store Vuex
        const storeComment = this.$store.state.comments.find( 
          storeComment => storeComment._id === this.textArea
        ); 
        if (storeComment) { 
          for ( let [key, value] of Object.entries(formData)) {
            storeComment[key] = value;
          } 
        } 
        //La note du restaurant doit aussi être actualisée dans le store Vuex  
        const store = this.$store.state.stores.find( 
          store => store._id === response.restaurantId
        ); 
        if (store) { 
          store.rank = response.updatedRank
        } 
        this.textArea = null;
      })
      .catch(error => this.displayError(error))
    },
    displayError(error) {
      this.$toast.open({
        message: error,
        type: "is-danger",
        position: "is-bottom",
        duration: 4000
      });
    },
    displaySuccess(success) {
      this.$toast.open({
        message: success,
        type: "is-success",
        position: "is-bottom",
        duration: 3000
      });
    }
  }
};
</script>


<style scoped>
.card {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 20px;
}
#modifier {
  margin-right: 20px;
}
</style>
