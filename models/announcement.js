const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},
    // image: { type: Image, required: false}
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;