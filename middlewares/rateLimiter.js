const setRateLimit = require("express-rate-limit");

const setRateLimitMiddleware = setRateLimit({
    windowMs : 60*100,
    max: 10,
    message: "Vous ne pouvez pas faire plus de 10 requêtes par secondes pour la création d'annonce.",
    headers: true
})

const settingRateLimiter = async(req, res, next) => {
    try {
        return setRateLimitMiddleware(req, res, next);
    } catch(err){
        return res.status(500).send( { message: "Erreur serveur." } )
    }
};

const rateLimiter = {
    settingRateLimiter,
};
module.exports = rateLimiter;