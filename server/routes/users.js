const express = require ('express');
const userControler = require ('../controller/userControl');
const auth = require ('../express middelware/auth');
const multer = require ('multer');

const upload = multer ()

const router = express.Router();

/*POST*/
router.post('/api/user/inscription', userControler.addNewUser);
router.post('/api/user/login', userControler.login);
router.post('/api/user/avatar',auth, upload.single('avatar'), userControler.postAvatar);

/*GET*/
router.get('/api/user/info', auth, userControler.getInfo);
router.get('/api/user/avatar',auth, userControler.serveAvatar);
router.get('/api/user/logout', userControler.logout);

/*PATCH*/
router.patch('/api/user/info', auth, userControler.patchInfo);
router.patch('/api/user/password', auth, userControler.password);
router.patch('/api/user/avatar', auth, userControler.patchDeleteAvatar);


/*DELETE*/
router.delete('/api/user/delete/:password', auth, userControler.delete);


module.exports = router