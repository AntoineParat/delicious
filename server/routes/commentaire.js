const express = require ('express');
const auth = require('../express middelware/auth');
const commentsControler = require("../controller/commentsControl");

const router = express.Router();

/*POST*/
router.post('/api/comment/add', auth, commentsControler.addComment);

/*GET*/
router.get('/api/comment/get/:id/:page', commentsControler.getComment);
router.get('/api/comment/avatar/:userId', commentsControler.commentAvatar);
router.get('/api/comment/count/:restaurantId', commentsControler.commentCount);
router.get('/api/comment/user-comments/:page', auth, commentsControler.getUserComments);

/*PATCH*/
router.patch('/api/comment/patch/:commentaireId', commentsControler.patchComment)

/*DELETE*/

module.exports = router