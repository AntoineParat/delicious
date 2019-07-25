import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "./router";
import { promises } from "fs";
// import { userInfo } from "os";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: null,
    user: {},
    avatarKey: 0,
    stores: [],
    comments: [],
    tags: [],
    storesByTags: [],
    reloadStores: false,
    page: 1,
    tagSelectorPage: 1,
    isWifi: "test",
    tagsIsloading: false
  },
  getters: {
    isConnected: state => {
      return state.isConnected;
    },
    userInfo(state) {
      return state.user;
    },
    stores(state) {
      return state.stores;
    },
    comments(state) {
      return state.comments;
    },
    page(state) {
      return state.page;
    },
    tagSelectorPage(state) {
      return state.tagSelectorPage;
    },
    tags(state) {
      return state.tags;
    },
    storesByTags(state) {
      return state.storesByTags;
    },
    tagsIsloading(state) {
      return state.tagsIsloading;
    }
  },
  mutations: {
    isConnected(state) {
      state.isConnected = true;
    },
    logout(state) {
      state.isConnected = false;
    },
    userInfo(state, element) {
      state.user = element;
    },
    updateInfo(state, element) {
      Object.assign(state.user, element);
    },
    updateStores(state, element) {
      element.forEach(store => {
        state.stores.push(store);
      });
    },
    addComments(state, comments) {
      comments.forEach(comment => {
        state.comments.push(comment);
      });
    },
    page(state) {
      state.page += 1;
    },
    resetTagSelectorPage(state) {
      state.tagSelectorPage = 1;
    },
    increaseTagSelectorPage(state) {
      state.tagSelectorPage += 1;
    },
    updateStoresByTags(state, tagsArray) {
      state.storesByTags = tagsArray;
    },
    pushStoresByTags(state, tagsArray) {
      tagsArray.forEach(tag => {
        state.storesByTags.push(tag);
      });
    },
    updateTagsIsloading(state, value) {
      state.tagsIsloading = value;
    }
  },
  actions: {
    signup({ dispatch, commit }, formData) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/user/inscription", formData)
          .then(response => {
            if (response.data.redirectUrl) {
              resolve(`Bienvenue ${response.data.name} !`);
              commit("isConnected");
              dispatch("getInfo");
            } else {
              reject(response.data.error);
            }
          })
          .catch(err => console.log(err));
      });
    },
    login({ commit }, formData) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/user/login", formData)
          .then(response => {
            if (response.data.redirectUrl) {
              commit("isConnected");
              commit("userInfo", response.data);
              resolve(`Bienvenu ${response.data.name} !`);
              router.replace(`${response.data.redirectUrl}`);
            } else {
              reject(response.data.error);
            }
          })
          .catch(err => console.log(err));
      });
    },
    logout({ commit }) {
      localStorage.removeItem("cookies");
      axios
        .get("/api/user/logout")
        .then(resp => {
          commit("logout");
        })
        .catch(err => console.log(err));
    },
    getInfo({ commit }) {
      axios
        .get("/api/user/info")
        .then(response => {
          if (!response.data.error) {
            commit("userInfo", response.data);
          } else {
            commit("error", response.data.error);
          }
        })
        .catch(error => console.log(error));
    },
    patchInfo({ dispatch }, formData) {
      return new Promise((resolve, reject) => {
        axios
          .patch("/api/user/info", formData)
          .then(response => {
            if (!response.data.error) {
              // formData.password ? delete formData.password : ''
              // commit("updateInfo", formData);
              dispatch("getInfo");
              resolve(response.data.success);
            } else {
              reject(response.data.error);
            }
          })
          .catch(error => console.log(error));
      });
    },
    storeInfo({ commit }, page) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/store/info/${page}`)
          .then(response => {
            if (!response.data.error) {
              commit("updateStores", response.data.success);
              resolve("ok");
            } else {
              reject(response.data.error);
            }
          })
          .catch(error => reject(error));
      });
    },
    getComments({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/comment/get/${payload.id}/${payload.page}`)
          .then(response => {
            if (!response.data.error) {
              commit("addComments", response.data.success);
              resolve();
            } else {
              reject(response.data.error);
            }
          })
          .catch(error => reject(error));
      });
    },
    getTags({ commit }, tags) {
      return new Promise((resolve, reject) => {
        commit("updateTagsIsloading", true);
        axios
          .get("/api/store/getTags/1", {
            params: { tags: tags }
          })
          .then(response => {
            if (!response.data.error) {
              commit("updateTagsIsloading", false);
              commit("resetTagSelectorPage");
              commit("updateStoresByTags", response.data.success);
              resolve();
            } else {
              commit("updateTagsIsloading", false);
              reject(response.data.error);
            }
          })
          .catch(error => reject(error));
      });
    },
    pushStoresByTags({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("updateTagsIsloading", true);
        axios
          .get(`/api/store/getTags/${payload.page}`, {
            params: { tags: payload.tags }
          })
          .then(response => {
            if (!response.data.error) {
              commit("updateTagsIsloading", false);
              commit("increaseTagSelectorPage");
              commit("pushStoresByTags", response.data.success);
              resolve();
            } else {
              commit("updateTagsIsloading", false);
              reject(response.data.error);
            }
          })
          .catch(error => reject(error));
      });
    }
  }
});
