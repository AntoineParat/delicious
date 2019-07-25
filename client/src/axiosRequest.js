import axios from "axios";

class axiosRequest {
  //get
  static searchStore(word) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/store/search/${word}`)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => reject(error));
    });
  }

  static getSearchStore(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/store/search/info/${id}`)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => reject(error));
    });
  }

  static commentCount(id) {
    return new Promise(resolve => {
      axios
        .get(`/api/comment/count/${id}`)
        .then(response => resolve(response.data.success))
        .catch(error => console.log(error));
    });
  }

  static getUserComments(page) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/comment/user-comments/${page}`)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => console.log(error));
    });
  }

  static userStores(page) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/store/userStores/${page}`)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => console.log(error));
    });
  }

  static getRanking() {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/store/ranking?test=coucou")
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => console.log(error));
    });
  }

  static getTags(tags) {
    return new Promise((resolve, reject) => {
      return axios
        .get("/api/store/getTags", {
          params: { name: tags }
        })
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => reject(error));
    });
  }

  static sendResetMail(email) {
    return new Promise((resolve, reject) => {
      return axios
        .get(`/api/user/sendMail?email=${email}`)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => reject(error));
    });
  }

  static getName(token) {
    return new Promise((resolve, reject) => {
      return axios
        .get(`/api/user/getName?token=${token}`)
        .then(response => {
          if(!response.data.error) { 
          resolve(response.data.success);
          } else {
            reject(response.data.error)
          }
        })
        .catch(error => console.log(error));
    });
  }

  static getAllCoords() {
    return new Promise((resolve, reject) => {
      return axios
        .get('/api/store/getAllCoords')
        .then(response => {
          if(!response.data.error) { 
          resolve(response.data);
          } else {
            reject(response.data.error)
          }
        })
        .catch(error => console.log(error));
    });
  }

  //post
  static addStore(formData) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/store/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(err => reject(err));
    });
  }

  static postAvatar(formData) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/user/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => reject(error));
    });
  }

  static postComment(formData) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/comment/add", formData)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => reject(error));
    });
  }

  //patch
  static patchPassword(formData) {
    return new Promise((resolve, reject) => {
      axios
        .patch("/api/user/password", formData)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(err => reject(err));
    });
  }

  static resetPassword(formData) {
    return new Promise((resolve, reject) => {
      axios
        .patch("/api/user/resetPassword", formData)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(err => reject(err));
    });
  }

  static patchDeleteAvatar() {
    return new Promise((resolve, reject) => {
      axios
        .patch("/api/user/avatar")
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.success);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => console.log(error));
    });
  }

  static patchComment(id, formData) {
    return new Promise((resolve, reject) => {
      axios
        .patch(`/api/comment/patch/${id}`, formData)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => console.log(error));
    });
  }

  //delete
  static deleteUser(password) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/api/user/delete/${password}`)
        .then(response => {
          if (!response.data.error) {
            resolve(response.data.redirect);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => console.log(error));
    });
  }
}

export default axiosRequest;
