const express = require('express');
// const etag = require('etag');
const mongoose = require('mongoose');
const authcontroller = require('./controllers/authcontroller');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/advanced-api-project?retryWrites=true&w=majority')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.post("/user/signup", authcontroller.signup);
app.post("/user/signin", authcontroller.signin);

module.exports = app;