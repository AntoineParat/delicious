const User = require("../model/user");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/*POST*/
exports.addNewUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateToken();
    await res.cookie("token", token);

    sgMail.send({
      to: user.email,
      from: "paratantoine@gmail.com",
      subject: "Bienvenu sur Foodelicious !",
      html: `<h1> Bonjour ${user.name} !</h1>
                <p>Vous vous êtes inscrit avec succès !</p>
                <p> A très vite sur <a href="https://foodelicious.herokuapp.com"> foodelicious !</a> </p>`
    });

    res.send({ redirectUrl: "/", name: user.name });
  } catch (err) {
    console.log(err);
    err.code === 11000
      ? res.send({ error: "Adresse mail ou nom d'utilisateur déjà existant" })
      : "";
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
      throw "Le fichier ne doit pas peser plus de 3 Mo";
      return;
    }
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 256, height: 256 })
      .png()
      .toBuffer();
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
    console.log(req.user.avatar);
    if (!req.user.avatar) {
      res.redirect(
        "https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg"
      );
      return;
    }
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-disposition",
      `filename="${req.user.name}-avatar.png"`
    );
    /*DOWNLOAD AVATAR*/
    // res.setHeader('Content-disposition', `attachment; filename="${req.user.name}-avatar.png" `);
    res.send(req.user.avatar);
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
      name: req.user.name
    });
  } catch (err) {
    res.send({ error: "Pas d'information disponible" });
  }
};

/*PATCH*/

exports.patchInfo = async (req, res) => {
  try {
    if (req.body.email) {
      // modification du mail
      const check = await bcrypt.compare(req.body.password, req.user.password);
      if (!check) {
        throw "Vérifiez votre mot de passe";
      } else {
        for (let [key, value] of Object.entries(req.body)) {
          req.user[key] = value;
        }
      }
    } else {
      // modifications autres que le mail
      for (let [key, value] of Object.entries(req.body)) {
        req.user[key] = value;
      }
    }
    await req.user.save();

    sgMail.send({
      to: req.user.email,
      from: "paratantoine@gmail.com",
      subject: "Votre adresse email a été modifiée",
      html: `<h1> Bonjour ${req.user.name}, </h1>
                <p>Votre adresse mail a bien été modifiée.</p>
                <p>A bientôt sur <a href="https://foodelicious.herokuapp.com"> foodelicious </a>!</p>`
    });

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

      sgMail.send({
        to: req.user.email,
        from: "paratantoine@gmail.com",
        subject: "Votre mot de passe a été modifiée",
        html: `<h1> Bonjour ${req.user.name}, </h1>
                <p>Votre mot de passe été modifiée. </p>
                <p>Si vous n'êtes pas à l'origine de cette demande, contactez-nous dans les plus brefs délais.</p>
                <p>A bientôt sur <a href="https://foodelicious.herokuapp.com"> foodelicious </a>!</p>`
      });

      res.send({ success: "Mot de passe modifié avec succès" });
    }
  } catch (err) {
    res.send({ error: err });
  }
};

exports.patchDeleteAvatar = async (req, res) => {
  try {
    if (!req.user.avatar) {
      throw "Vous n'avez pas de photo à supprimer";
      return;
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send({ success: "La photo de profil a été supprimée" });
  } catch (err) {
    res.send({ error: err });
  }
};

/*DELETE*/
exports.delete = async (req, res) => {
  try {
    const check = await bcrypt.compare(req.params.password, req.user.password);
    if (!check) {
      throw "Le mot de passe ne permet pas de vous identifier";
      return;
    }

    await sgMail.send({
      to: req.user.email,
      from: "paratantoine@gmail.com",
      subject: `Au revoir ${req.user.name} !`,
      html: `<p> Nous sommes tristes de vous voir partir.</p>
      <p>Mais nous espérons vous revoir bientôt sur <a href="https://foodelicious.herokuapp.com"> foodelicious </a>!</p>`
    });

    await req.user.remove();
    res.send({ redirect: "/" });
  } catch (err) {
    res.send({ error: err });
  }
};

exports.sendMail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) {
      throw "Cette adresse email n'est associée à aucun compte sur le site.";
      return;
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "0.25h"
    });

    await sgMail.send({
      to: user.email,
      from: "paratantoine@gmail.com",
      subject: `Demande de réinitialisation du mot de passe`,
      html: `<p>Bonjour${user.name},</p> 
              <p> Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:8080/reset-password/${token} </p>
              <p>Attention, ce lien n'est valable que 15 minutes</p
              <p> Si vous n'êtes pas à l'origine de cette demande, contactez-nous dans les plus brefs délais.</p>`
    });
    res.send({
      success: `Un mail de réinitialisation a été envoyé à ${user.email} `
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

exports.getName = async (req, res) => {
  try{
    const decoded = await jwt.verify(req.query.token, process.env.JWT_SECRET);
     const user = await User.findOne({_id : decoded._id});
     res.send({success : user.name})
  } catch (err) {
    res.send({error : "Le délai de validité du lien de réinitialisation est écoulé."})
    console.log(err)
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const decoded = await jwt.verify(req.body.user, process.env.JWT_SECRET);
    const user = await User.findOne({_id : decoded._id});
    user.password = req.body.password;
    await user.save();

    await sgMail.send({
      to: user.email,
      from: "paratantoine@gmail.com",
      subject: `Réinitialisation du mot de passe`,
      html: `<p>Bonjour${user.name},</p> 
              <p> Votre mot de passe a bien été réinitialisé. </p>
              <p> Si vous n'êtes pas à l'origine de cette demande, contactez-nous dans les plus brefs délais.</p>
              <p>A bientôt sur <a href="https://foodelicious.herokuapp.com"> foodelicious </a>!</p>`
    });
    res.send({
      success: 'Votre mot de passe a bien été réinitialisé.'
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};
