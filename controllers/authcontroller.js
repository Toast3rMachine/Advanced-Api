const User = require("../models/users");
const config = require("../config/key");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios")
require("dotenv").config()
const GITHUB_URL = "https://github.com/login/oauth/access_token"

exports.signup = async (req, res) => {
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

exports.signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé" });
    }
    
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({ 
            accessToken: null, 
            message: "Mot de passe incorrect" 
        });
    }
    const token = jwt.sign({ id: user._id, firstname: user.firstname },
        config.secret,
        { 
            algorithm: 'HS256', 
            allowInsecureKeySizes: true, 
            expiresIn: 3600 
        }
    );
    res.cookie("access_token", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
    })
    res.status(200).send({ 
        id: user._id, 
        firstname: user.firstname, 
        accessToken: token 
    });
};

exports.oauth2 = async (req, res) => {
    try {
        const response = await axios({
            method: "POST",
            url: `${GITHUB_URL}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.SECRET_CLIENT_ID}&code=${req.query.code}`,
            headers: {
                Accept: "application/json",
            },
        });
        const userData = await axios({
            method: "GET",
            url: `https://api.github.com/user`,
            headers: {
                Authorization: "token " + response.data.access_token,
            },
        });
        const { login, email } = userData.data;
        let user = await User.findOne({ firstname: login });
        if (!user){
            user = new User({
                firstname: login,
                lastname: "Unknow",
                email: email ? email : "Unknow"
            });
            try {
                await user.save();
            } catch (err) {
                console.log(err);
                res.status(500).send("Impossible de créer un compte.")
            }
        }
        const token = jwt.sign({ id: user._id, firstname: user.firstname },
            config.secret,
            { 
                algorithm: 'HS256', 
                allowInsecureKeySizes: true, 
                expiresIn: 3600 
            }
        );
        res.cookie("access_token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
        })
        res.redirect(
            `http://localhost:5173`
        )

    } catch (err) {
        console.log("Une erreur est survenue pendant l'authentification avec github : " + err);
        res.status(500).send("Impossible de s'authentifier avec github");
    }
}

exports.me = async (req, res) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, config.secret)

        const user = await User.findOne({ _id: decoded.id })
        if (!user) {
            res.status(401).send({ message : "Utilisateur déconnecté, veuillez vous connecter." })
        }
        const userJson = {
            id : decoded.id,
            firstname : decoded.firstname
        } 
        
        res.status(200).json(userJson);
    } catch (err) {
        res.status(500).send({ message: "Impossible d'accéder aux données utilisateur." })
    }
}

exports.signout = async (req, res) => {
    res.clearCookie("access_token");
    res.status(200).send({ message: "Utilisateur déconnecté avec succès." });
};