const express = require ('express');
const storeControler = require('../controller/storesControl');
const auth = require('../express middelware/auth');
const multer = require ('multer');

const upload = multer ()

const router = express.Router();

/*POST*/
router.post('/api/store/add', auth, upload.array('photos', 5), storeControler.add)

/*GET*/
router.get('/api/store/info', auth, storeControler.info)

/*PATCH*/

/*DELETE*/

module.exports = router