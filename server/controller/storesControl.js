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
        .resize({ width: 800, height: 480 })
        .png()
        .toBuffer();
      store.photos.push(buffer);
    }
    await store.save();
    res.send({ success: "Le restaurant a bien été ajouté !" });
  } catch (err) {
    if (err.code === 11000) {
        res.send({error : "Un restaurant existe déjà à cette adresse"})
        return
    }
    res.send({ error: err });
  }
};

/*GET*/
exports.info = async (req, res) => {
  try {
    // const store = await Store.findOne({ tags: "chic" });
    const store = await Store.find();
    res.send({store : store})

    if (!store) {
      throw "Aucun restaurant ne correspond à vos critères de recheche";
      return;
    }
    res.send({ success: store });
  } catch (err) {
    res.send({ error: err });
  }
};

/*PATCH*/

/*DELETE*/
