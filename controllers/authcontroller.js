const User = require('../models/users')
var bcrypt = require('bcryptjs')

exports.signup = async(req, res) => {
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
        res.status(500).send({ message : "Erreur lors de la création du compte."})
    }
}