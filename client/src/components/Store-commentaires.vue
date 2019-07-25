<template>
  <div id="commentaires">
    <div id="boxComment" class="box">
      <span>
        <strong>Commentaire<span v-if="count >1">s</span></strong>
        : {{count}}
      </span>
      <span
        class="button is-primary"
        @click="comment = !comment"
        v-if="!comment"
      >Ajouter un commentaire</span>
      <span class="button is-primary" @click="reset" v-if="comment">Annuler</span>
    </div>
    <div class="notification is-warning has-text-centered" v-if="hasComment===false">
      <strong>Soyez le (ou la) premier(e) à ajouter un commentaire !</strong>
    </div>
    <!-- AJOUTER COMMENTAIRE -->
    <transition name="fade">
      <div v-if="comment">
        <form @submit.prevent="validateBeforeSubmit" autocomplete="off">
          <div class="field">
            <label class="label">Note</label>
            <star-rating :star-size="30" v-model="stars" v-validate="'required'" name="star"></star-rating>
            <span style="color: red" v-if="error">Vous devez donner une note</span>
          </div>

          <b-field label="Commentaire" :type="{'is-danger': errors.has('textArea')}">
            <b-input
              maxlength="200"
              name="textArea"
              type="textarea"
              v-model="textArea"
              v-validate="'required'"
            ></b-input>
          </b-field>

          <div class="flex-right">
            <button type="submit" class="button is-primary">Envoyer</button>
          </div>
        </form>
      </div>
    </transition>

    <div class="card" v-for="(comment, index) in returnedComments" :key="index">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img
                :src=" '/api/comment/avatar/' + comment.userId "
                class="is-rounded"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{comment.userName}}</p>
            <star-rating
              :rating="comment.rank"
              :read-only="true"
              :increment="0.1"
              :star-size="20"
              :show-rating="false"
            ></star-rating>
          </div>
        </div>

        <div class="content">
          <p>{{comment.commentaire}}</p>
          <br />
          <time>Ajouté le {{comment.date}}</time>
        </div>
      </div>
    </div>
    <div
      v-infinite-scroll="getComments"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="0"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500"
    ></div>
    <app-back-to-top></app-back-to-top>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
import axiosRequest from "../axiosRequest";
import BackToTop from "../components/Back-to-top";
export default {
  props: ["store"],
  components: {
    "app-back-to-top": BackToTop
  },
  data() {
    return {
      comment: false,
      textArea: null,
      firstname: null,
      stars: null,
      error: false,
      isLoading: false,
      isFullPage: false,
      commentaires: [],
      page: 1,
      count: null,
      busy: false,
      hasComment : true
    };
  },
  created() {
    if (this.returnedComments.length > 0) {
      this.page = parseInt(this.returnedComments.length / 10 + 2) //retrouve la prochaine page à requêter
    } else {
      this.getComments();
    }
  },
  beforeMount() {
    axiosRequest
      .commentCount(this.store._id)
      .then(response => {
        response < 1 ? this.hasComment = false : this.hasComment = true;
        this.count = response
      });
  },
  methods: {
    reset() {
      this.comment = false;
      this.textArea = this.stars = null
    },
    getComments() {
      this.busy = true;
      this.$store
        .dispatch("getComments", { id: this.store._id, page: this.page })
        .then(response => {
          this.page += 1;
          this.busy = false;
        });
    },
    checkConnected() {
      if (!this.$store.getters.isConnected) {
        this.displayError(
          "Vous devez être connecté pour écrire un commentaire"
        );
        return;
      }
      this.postComment();
    },
    postComment() {
      this.isLoading = true;

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const minutes = String(today.getMinutes()).padStart(2, "0");

      const formData = {
        restaurantId: this.store._id,
        restaurantName : this.store.name,
        rank: this.stars,
        commentaire: this.textArea,
        date: `${dd}/${mm}/${yyyy}, à ${today.getHours()}h${minutes}`
      };

      axiosRequest
        .postComment(formData)
        .then(response => {
          this.isLoading = false;
          this.displaySuccess(response.success);
          this.textArea = this.stars = null;
          this.comment = this.error = false;

          //Apres avoir ajouté à l'Objet les informations nécessaires renvoyées par le serveur...
          //Le commentaire est pushé dans le tableau "comments" du store Vuex afin d'être affiché tout de suite.
          Object.assign(formData, {
            userName: response.userName,
            userId: response.userId
          });
          this.$store.state.comments.unshift(formData);

          //Le nombre de commentaires est donc artificiellement mis à jour
          this.count += 1;

          //je recherche le restaurant grace à la méthode .find
          const update = this.$store.state.stores.find(
            element => element._id === this.store._id
          ); 
          if (update) { 
            //Si le restaurant est déjà contenu dans le tableau "stores" du store Vuex....
            update.rank = response.updatedRank; //sa note est mise à jour grace à l'info renvoyée par serveur.
          } else {
            // Si non (cas d'une recherche direct dans la base de donnée)...
            axiosRequest
              .getSearchStore(this.store._id) //Je demande au serveur les infos du restaurants
              .then(response => (this.store.rank = response.rank)); // et j'actualise sa note à partir de la réponse du serveur
          }
        })
        .catch(error => {
          this.isLoading = false;
          this.displayError(error);
        });
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.error = false;
          this.checkConnected();
          return;
        }
        this.error = true;
        this.displayError("Veuillez remplir tous les champs du formulaire");
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
    displaySuccess(success) {
      this.$toast.open({
        message: success,
        type: "is-success",
        position: "is-bottom",
        duration: 3000
      });
    }
  },
  computed: {
    returnedComments() {
      return this.$store.getters.comments.filter(
        comment => comment.restaurantId === this.store._id
      );
    }
  }
};
</script>

<style scoped>
@media (max-width: 768px) {
  #commentaires {
    width: 90%;
    margin: auto;
  }

  #boxComment {
  display: flex;
  flex-direction: column;
  align-items: center;
  }

  .button {
    margin-top : 10px
  }
}
@media (min-width: 769px) {
  #commentaires {
    width: 65%;
    margin: auto;
  }

  #boxComment {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
}
#boxComment {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.flex-right {
  margin-bottom: 20px;
  margin-top: 0px;
}
</style>

