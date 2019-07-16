const Store = require("../model/store");
const sharp = require("sharp");

/*POST*/
exports.add = async (req, res) => {
  try {
    const store = new Store(req.body);
    Object.assign(store, { userId: req.user._id });

    for (let file of req.files) {
      if (file.size > 3000000) {
        throw "Le fichier ne doit pas peser plus de 3 Mo";
        return;
      }

      let buffer = await sharp(file.buffer)
        .resize({ width: 600, height: 480 })
        .png()
        .toBuffer();

      let photo = {
        name: file.originalname,
        picture: buffer
      };
      store.photos.push(photo);
    }

    await store.save();
    res.send({ success: "Le restaurant a bien été ajouté !" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.send({ error: "Un restaurant existe déjà à cette adresse" });
      return;
    }
    res.send({ error: err });
  }
};

/*GET*/
exports.info = async (req, res) => {
  try {
    const page = req.params.page;
    const store = await Store.find()
    .limit(6)
    .skip(parseInt(page -1) * 6)
    .sort({createdAt : -1})
    
    if (!store) {
      throw "Aucun restaurant ne correspond à vos critères de recheche";
      return;
    }
  
    store.forEach(e => {
      e.photos[0].picture = undefined;
    });

    res.send({ success: store,});
  } catch (err) {
    res.send({ error: err });
  }
};

exports.getAvatar = async (req, res) => {
  try {
    let store = await Store.findOne({ _id: req.params.store });
    let photo = store.photos.find(e => e.name === req.params.img);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-disposition", `filename="${store.name}-photo.png"`);
    res.send(photo.picture.buffer);
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

exports.search = async (req,res) => {
  try {
    const searchStore = await Store.find({$text: {$search: req.params.name}})
    const returnStore = [];
    searchStore.forEach(e => 
      returnStore.push({name : e.name, id : e._id, adresse : e.adresse})
    )
    res.send({success : returnStore})
  } catch (err) {
    console.log(err)
    res.send({error : err})
  }
}

exports.getSearchStore= async (req, res) => {
  try {
    const store = await Store.findOne({_id : req.params.id})
   
    if (!store) {
      throw "Aucun restaurant ne correspond à vos critères de recheche";
      return;
    }
    res.send({ success: store,});
    console.log(store)
  } catch (err) {
    res.send({ error: err });
  }
};

/*PATCH*/

/*DELETE*/
