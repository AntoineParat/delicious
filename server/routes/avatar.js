const express = require ('express');
const auth = require('../express middelware/auth');
const Avatar = require('../model/photo')
const multer = require ('multer');
const sharp = require("sharp");

const upload = multer ()

const router = express.Router();

/*POST*/
router.post('/api/avatar/add', auth, upload.single('avatar'), async (req,res) => {
    try {
        if (req.file.size > 3000000) {
          throw "Le fichier ne doit pas peser plus de 3 Mo"
          return
        }
        const buffer = await sharp(req.file.buffer)
          .resize({width : 256, height : 256})
          .png()
          .toBuffer()
          const avatar = new Avatar({userId : req.user._id, avatar : buffer})
          await avatar.save()
          res.send({ success: "La photo de profil a été modifiée" });
      } catch (err) {
        res.send({ error: err });
      }
});

/*GET*/
router.get('/api/avatar/get/:id', async (req,res) => {
    try { 
        const avatar = await Avatar.findOne({userId : req.params.id})
        res.setHeader("Content-Type", "image/png");
        res.setHeader(
          "Content-disposition",
          `filename="avatar.png"`
        );
        /*DOWNLOAD AVATAR*/
        // res.setHeader('Content-disposition', `attachment; filename="${req.user.name}-avatar.png" `);
        res.send(avatar.avatar);
      } catch (err) {
        res.status(404).send(err);
      }
});


/*PATCH*/

/*DELETE*/

module.exports = router