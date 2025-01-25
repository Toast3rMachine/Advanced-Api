const jwt = require("jsonwebtoken");
const config = require("../config/key.js");
const User = require("../models/users.js");

isExist = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(403).send({ message: "Utilisateur inconnu" });
        return;
    }
    next();
};

verifyToken = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(403).send({ message: "Veuillez vous connecter afin d'effectuer cette action." });
    }
    try {
        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).send({ message: "Une erreur est survenue. Impossible de vous authentifier." });
    }
};

const authJwt = {
    verifyToken,
    isExist
};
module.exports = authJwt;