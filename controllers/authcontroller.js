const express = require("express");
const router = express.Router();
const User = require("../models/users");
const config = require("../config/key");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Inscription
const signup = async (req, res) => {
    const userMail = await User.findOne({ email: req.body.email });
    if (userMail) {
        return res.status(401).send({ message: "Cet email est déjà associé à un compte." });
    }

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 16),
    });

    try {
        await user.save();
        res.status(200).send({ message: "Utilisateur enregistré avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Erreur lors de la création du compte." });
    }
};

// Connexion
const signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({ accessToken: null, message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id, firstname: user.firstname },
        config.secret,
        { algorithm: 'HS256', allowInsecureKeySizes: true, expiresIn: 3600 }
    );

    res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.status(200).send({ id: user._id, firstname: user.firstname, accessToken: token });
};

// Déconnexion
const signout = async (req, res) => {
    res.clearCookie("access_token");
    req.logout(() => {
        res.status(200).send({ message: "Utilisateur déconnecté avec succès." });
    });
};

// Exporter les fonctions ET les routes
module.exports = {
    signup,
    signin,
    signout,
};
