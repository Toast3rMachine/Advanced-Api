const express = require('express');
const mongoose = require('mongoose');
const authcontroller = require('./controllers/authcontroller');
const announcementcontroller = require('./controllers/announcementcontroller');
const app = express();
const authJwt = require('./middlewares/authJwt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/advanced-api-project?retryWrites=true&w=majority')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.post("/user/signup", authcontroller.signup);
app.post("/user/signin", authcontroller.signin);

app.post("/announcement/create", [authJwt.verifyToken, authJwt.isExist, announcementcontroller.create]);
app.put("/announcement/update/:id", [authJwt.verifyToken, authJwt.isExist, announcementcontroller.update]);
app.delete("/announcement/delete/:id", [authJwt.verifyToken, authJwt.isExist, announcementcontroller.delete]);

module.exports = app;