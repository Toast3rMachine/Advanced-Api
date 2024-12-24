const User = require('../models/users')
var bcrypt = require('bcryptjs')

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