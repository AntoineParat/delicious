const User = require("../model/user");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");

/*POST*/
exports.addNewUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateToken();
    await res.cookie("token", token);
    // sgMail.send({
    //     to : user.email,
    //     from : 'paratantoine@gmail.com',
    //     subject : "Welcome to your to-do-list application !",
    //     html : `<h1> Welcome ${user.name} ! You successfully registered ! </h1>
    //             <p>Have fun using your very new to-do App !</p>`
    // })
    res.send({ redirectUrl: "/", name : user.name });
  } catch (err) {
    console.log(err)
    err.code === 11000 ? res.send({error : "Adresse mail ou nom d'utilisateur déjà existant"}) : ''
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    await res.cookie("token", token);
    res.send({
      redirectUrl: "/",
      age: user.age,
      phone: user.phone,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    res.send({
      error: "Connexion impossible. Vérifiez vos identifiants"
    });
    console.log(err);
  }
};

exports.postAvatar = async (req, res) => {
  try {
    if (req.file.size > 3000000) {
      throw "Le fichier ne doit pas peser plus de 3 Mo"
      return
    }
    const buffer = await sharp(req.file.buffer)
      .resize({width : 256, height : 256})
      .png()
      .toBuffer()
      req.user.avatar = buffer;
      await req.user.save();
      res.send({ success: "La photo de profil a été modifiée" });
  } catch (err) {
    res.send({ error: err });
  }
};


/*GET*/
exports.serveAvatar = (req, res) => {
  try {
    // if (!req.user.avatar) {
      res.redirect(
        "https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg"
       );
    //   return
    // }
    // res.setHeader("Content-Type", "image/png");
    // res.setHeader(
    //   "Content-disposition",
    //   `filename="${req.user.name}-avatar.png"`
    // );
    /*DOWNLOAD AVATAR*/
    //res.setHeader('Content-disposition', `attachment; filename="${req.user.name}-avatar.png" `);
    // res.send(req.user.avatar);
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.send({ msg: "cookies deleted" });
};

exports.getInfo = (req, res) => {
  try {
    res.send({
      age: req.user.age,
      phone: req.user.phone,
      email: req.user.email,
      name: req.user.name,
    });
  } catch (err) {
    res.send({ error: "Pas d'information disponible" });
  }
};

/*PATCH*/

exports.patchInfo = async (req, res) => {
  try {
    if (req.body.email) {
      const check = await bcrypt.compare(req.body.password, req.user.password);
      if (!check) {
        throw "Vérifiez votre mot de passe";
      } else {
        for (let [key, value] of Object.entries(req.body)) {
          req.user[key] = value;
        }
      }
    } else {
      for (let [key, value] of Object.entries(req.body)) {
        req.user[key] = value;
      }
    }
    await req.user.save();
    res.send({ success: "Modifications effectuées" });
  } catch (err) {
    res.send({ error: err });
  }
};

exports.password = async (req, res) => {
  try {
    const check = await bcrypt.compare(req.body.password, req.user.password);
    if (!check) {
      throw "Le mot de passe n'a pas permis de vous identifier";
    } else {
      req.user.password = req.body.newPassword;
      await req.user.save();
      res.send({ success: "Mot de passe modifié avec succès" });
    }
  } catch (err) {
    res.send({ error: err });
  }
};

exports.patchDeleteAvatar = async (req,res) => {
  try{
    if (!req.user.avatar) {
      throw "Vous n'avez pas de photo à supprimer"
      return
    }
    req.user.avatar = undefined;
    await req.user.save()
    res.send({success : "La photo de profil a été supprimée"})
  } catch(err) {
    res.send({error : err})
  }
}

/*DELETE*/
exports.delete = async (req, res) => {
  try {
    const check = await bcrypt.compare(req.params.password, req.user.password);
    if (!check) {
      throw "Le mot de passe ne permet pas de vous identifier";
      return;
    }
    //Send Mail
    await req.user.remove();
    res.send({ redirect: "/" });
  } catch (err) {
    res.send({ error: err });
  }
};

