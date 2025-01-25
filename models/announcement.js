const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},
    image: { type: String, required: false},
    author: { type: String, required: true} //Seule solution trouvée pour récupérer les annonces de l'utilisateur qui les a créées.
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;