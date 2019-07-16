const express = require ('express');
const storeControler = require('../controller/storesControl');
const auth = require('../express middelware/auth');
const multer = require ('multer');

const upload = multer ()

const router = express.Router();

/*POST*/
router.post('/api/store/add', auth, upload.array('photos', 5), storeControler.add);

/*GET*/
router.get('/api/store/info/:page', storeControler.info);
router.get('/api/store/avatar/:store/:img', storeControler.getAvatar);
router.get('/api/store/search/:name', storeControler.search);
router.get('/api/store/search/info/:id', storeControler.getSearchStore);

/*PATCH*/

/*DELETE*/

module.exports = router