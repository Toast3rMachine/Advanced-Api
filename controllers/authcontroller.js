const User = require('../models/users')
const config = require("../config/key");
var bcrypt = require('bcryptjs')
var jwt = require("jsonwebtoken")

exports.signup = async(req, res) => {
    const userMail = await User.findOne({ email : req.body.email});
    if (userMail != null && userMail.email == req.body.email){
        return res.status(401).send({ message: "Cette email est déjà associé à un compte."})
    }
    
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 16),
    });
    try {
        await user.save();
        res.status(200).send({ message: "Utilisateur enregistré avec succés."});
    } catch (err){
        console.log(err);
        res.status(500).send({ message: "Erreur lors de la création du compte."})
    }
}

exports.signin = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid){
        return res.status(401).send({
            accessToken: null,
            message: "Mot de passe incorrect",
        })
    }
    const token = jwt.sign({ id: user._id, firstname: user.firstname },
        config.secret,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 3600, // 1 hour
        }
    );
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
    res.status(200).send({
        id: user._id,
        firstname: user.firstname,
        accessToken: token,
    });
}

exports.signout = async(req, res) => {
    res.clearCookie("access_token");
    res.status(200).send({ message : "Utilisateur déconnecté avec succès."})
}