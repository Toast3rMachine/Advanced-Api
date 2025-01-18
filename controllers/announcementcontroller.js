const etag = require('etag');
const Announcement = require('../models/announcement')

exports.create = async(req, res) => {
    const announcement = new Announcement({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });
    try {
        await announcement.save();
        res.status(200).send({ message: "Annonce créée avec succés."});
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Erreur lors de la publication de l'annonce."})
    }
}

exports.update = async(req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement){
        return res.status(404).send("Annonce non trouvée");
    }

    const clientETag = req.headers['if-match'];
    const currentETag = etag(JSON.stringify(announcement));
    console.log(clientETag);
    console.log(currentETag);
    if (clientETag !== currentETag) {
        return res.status(412).send("Precondition Failed: L'Etag ne correspond pas."); // 412 Precondition Failed
    }

    announcement.title = req.body.tile || announcement.title;
    announcement.description = req.body.description || announcement.description;
    announcement.image = req.body.image || announcement.image;

    try {
        const updateAnnouncement = await announcement.save();
        res.status(200).json(updateAnnouncement);
    } catch(err){
        console.log(err);
        res.status(500).send("Une erreur est survenue lors de la modification de l'annonce.")
    }

}

exports.delete = async(req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if(!announcement){
        return res.status(404).send("Annonce non trouvée");
    }

    try {
        await announcement.deleteOne({ id: announcement._id });
        res.status(200).send("Annonce supprimée avec succés.");
    } catch(err) {
        console.log(err);
        res.status(500).send("Une erreur est survenue lors de la suppression de l'annonce.")
    }
}