const jwt = require("jsonwebtoken");
const config = require("../config/key.js");
const User = require("../models/users.js");

verifyToken = (req, res, next) => {
    const token = req.headers["access-token"];

    if (!token) {
    return res.status(403).send({ message: "Aucun Token donné" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
        return res.status(401).send({
        message: "Non autorisé",
        });
    }
    req.userId = decoded.id;
    next();
    });
};

isExist = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(403).send({ message: "Utilisateur inconnu" });
        return;
    }
    next();
};

const authJwt = {
    verifyToken,
    isExist
};
module.exports = authJwt;