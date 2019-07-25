const Commentaire = require("../model/commentaire");
const Store = require("../model/store");
const User = require("../model/user");

/*POST*/
exports.addComment = async (req, res) => {
  try {
    const check = await Commentaire.findOne({restaurantId : req.body.restaurantId, userId : req.user._id})
    if (check) {
        throw "Vous avez déjà posté un commentaire pour ce restaurant"
        return
    }
    const comment = req.body;
    Object.assign(comment, { userId: req.user._id, userName: req.user.name });
    commentaire = await new Commentaire(comment);
    await commentaire.save();

    const countStars = await Commentaire.find({
      restaurantId: comment.restaurantId
    }).countDocuments();
    const stars = await Commentaire.find({
      restaurantId: comment.restaurantId
    });
    let totalRanks = 0;
    stars.forEach(element => {
      totalRanks += element.rank;
    });
    const averageRank = totalRanks / countStars;
    const store = await Store.findOne({ _id: comment.restaurantId });
    store.rank = averageRank.toFixed(2);
    await store.save();
    res.send({
      success: "Votre commentaire a bien été ajouté",
      updatedRank: store.rank,
      userName: req.user.name,
      userId: req.user._id
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

/*GET*/
exports.getComment = async (req, res) => {
  try {
    const page = req.params.page;
    const commentaire = await Commentaire.find({ restaurantId: req.params.id })
      .limit(10)
      .skip(parseInt(page - 1) * 10)
      .sort({ updatedAt: -1 });
    if (!commentaire) {
      throw "Soyez le premier à ajouter un commentaire !";
      return;
    }
    res.send({ success: commentaire });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

exports.commentCount = async (req, res) => {
  try {
    const count = await Commentaire.find({
      restaurantId: req.params.restaurantId
    }).countDocuments();
    res.send({ success: count });
  } catch (err) {
    console.log(err);
  }
};

exports.commentAvatar = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if(!user.avatar) {
      return res.redirect( "https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg")
    }
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-disposition", `filename="${user.name}-avatar.png"`);
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const page = req.params.page;
    const count = await Commentaire.find({
      userId: req.user._id
    }).countDocuments();
    const userComments = await Commentaire.find({ userId: req.user._id })
      .limit(3)
      .skip(parseInt(page - 1) * 3)
      .sort({ updatedAt : -1 });
      
    if (!userComments) {
      throw "Vous n'avez laissé aucun commentaire pour l'instant";
      return;
    }
    res.send({ success: userComments, count });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

/*PATCH*/
exports.patchComment = async (req, res) => {
  try {
    const comment = await Commentaire.findOne({
      _id: req.params.commentaireId
    });
    for (let [key, value] of Object.entries(req.body)) {
      comment[key] = value;
    }
    await comment.save();

    const countStars = await Commentaire.find({
      restaurantId: comment.restaurantId
    }).countDocuments();
    const stars = await Commentaire.find({
      restaurantId: comment.restaurantId
    });
    let totalRanks = 0;
    stars.forEach(element => {
      totalRanks += element.rank;
    });
    const averageRank = totalRanks / countStars;
    const store = await Store.findOne({ _id: comment.restaurantId });
    store.rank = averageRank.toFixed(2);
    await store.save();
    res.send({
      success: "Votre commentaire a bien été modifié",
      updatedRank: store.rank,
      restaurantId: store._id
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};
