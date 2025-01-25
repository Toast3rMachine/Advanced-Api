const etag = require('etag');
const config = require("../config/key");
const Announcement = require('../models/announcement')
var jwt = require("jsonwebtoken")

exports.create = async(req, res) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, config.secret)

        const announcement = new Announcement({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            author: decoded.id
        });
        await announcement.save();
        res.status(201).send({ message: "Annonce créée avec succés."});
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Erreur lors de la publication de l'annonce."})
    }
}

exports.getList = async(req, res) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, config.secret)

        const announcements = await Announcement.find( { author: decoded.id } );
        res.setHeader("Cache-Control", "no-cache")
        res.status(200).json(announcements)
    } catch (err) {
        res.status(500).send("Impossible de récupérer la liste des annnonces.")
    }
}

exports.getDetails = async(req, res) => {
    try {

        announcement = await checkAuthorization(req, res);

        if (announcement instanceof Announcement){
            const announcementJson = JSON.stringify(announcement);
            const hash = etag(announcementJson);
            if (req.headers['if-none-match'] === hash) {
                return res.status(304).send("L'annonce n' pas été modifié");
            }
            res.setHeader('ETag', hash);
            res.status(200).json(announcement);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Impossible de récupérer les détails de l'annonce getDetails");
    }
}


exports.update = async(req, res) => {
    try {

        announcement = await checkAuthorization(req, res);

        if (announcement instanceof Announcement){
            const clientETag = req.headers['if-match'];
            const currentETag = etag(JSON.stringify(announcement));
            console.log(clientETag);
            console.log(currentETag);
            if (clientETag !== currentETag) {
                return res.status(412).send("Precondition Failed: L'Etag ne correspond pas."); // 412 Precondition Failed
            }

            announcement.title = req.body.title || announcement.title;
            announcement.description = req.body.description || announcement.description;
            announcement.image = req.body.image || announcement.image;

            const updateAnnouncement = await announcement.save();
            res.status(200).json(updateAnnouncement);
        }
    } catch(err){
        console.log(err);
        res.status(500).send("Une erreur est survenue lors de la modification de l'annonce.")
    }

}

exports.delete = async(req, res) => {
    try {

        announcement = await checkAuthorization(req, res);

        if (announcement instanceof Announcement){
            await announcement.deleteOne({ id: announcement._id });
            res.status(200).send("Annonce supprimée avec succés.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Une erreur est survenue lors de la suppression de l'annonce.")
    }
}

async function checkAuthorization(req, res){
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, config.secret)

    const announcement = await Announcement.findById(req.params.id);
    if(!announcement){
        res.status(404).send("Impossible de trouver l'annonce.");
        return false;
    } else if(announcement.author != decoded.id){
        res.status(403).send("Vous n'avez pas les permissions pour effectuer cette action.");
        return false;
    }
    return announcement;
}