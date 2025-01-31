# Projet API Avancée

## Présentation des auteurs

Les développeurs ayant travaillés sur ce projet sont :
- Jeremy Villanova (campus de Bordeaux)
- Adam Lasmi (campus de Bordeaux)

## Présentation de l'application

### Faire fonctionner l'apli en local

Pour faire fonctionner l'application en local, vous devez d'abord cloner le projet puis faire un 
``` npm i ``` dans votre terminal.

Puis faire un ``` npm run start ``` pour lancer l'application.

Veuillez également à créer un dossier ``` config ``` et d'y créer un fichier ``` key.js ```
contenant le code suivant : 
```
module.exports = {
    secret: "[Votre clé secrète]"
}
```
Cela servira à l'encryptage des jwt.

Vous aurez également besoin d'un fichier ``` .env ``` contenant les informations suivantes :
```
CLIENT_ID=[Votre ID github]
SECRET_CLIENT_ID=[Votre ID secret github]
```
Ces ID peuvent être trouvé sur votre compte github en suivant ces étapes Settings -> Developper Settings -> OAuth APP.
Il vous faudra créer une nouvelle app pour faire fonctionner l'OAuth à github.

Le port à mongodb est ``` 27017 ``` et le nom de la db est ``` advanced-api-project ```

## Routes de l'application

Ci-dessus vous trouverez les routes présentent utilisable via postman ainsi que ce quelle demande et ce qu'elle renvoie.

### Routes Utilisateur
- http://localhost:3000/user/signup
Envoie de donnée au format JSON :
```
{
    "firstname": "",
    "lastname": "",
    "email": "",
    "password": ""
}
```
Réponse : Message de succés.

- http://localhost:3000/user/signin
Envoie de donnée au format JSON :
```
{
    "email": "",
    "password": ""
}
```
Réponse : Cookie contenant le jwt + un JSON contenant l'id, le prénom et le jwt de l'utilisateur

- http://localhost:3000/user/signout
Seul le cookie est envoyé pour supression de ce dernier.
Reponse : Message de succés.

### Routes Annonce
- http://localhost:3000/announcement/create
Envoie du cookie pour vérifier que l'utilisateur est bien connecté.
Envoie de donnée au format JSON :
```
{
    "title": "",
    "description": ""
}
```
Réponse : Message de succés et envoie de l'Etag dans les headers.

- http://localhost:3000/announcement/list
Envoie du cookie pour vérifier que l'utilisateur est bien connecté.
Aucun JSON nécéssaire.

Réponse : Liste des annonces de l'utilisateur

- http://localhost:3000/announcement/details/:id
Lecture de :id
Envoie du cookie pour vérifier que l'utilisateur est bien connecté.
Aucun JSON nécéssaire.

Réponse : Annonce demandé par l'utilisateur et envoie de l'Etag dans les headers.

- http://localhost:3000/announcement/update/:id
Lecture de :id
Envoie du cookie pour vérifier que l'utilisateur est bien connecté et vérification de l'Etag donné.
Envoie de donnée au format JSON :
```
{
    "title": "",
    "description": ""
}
```
Réponse : Renvoie de l'annonce modifiée au format JSON.

- http://localhost:3000/announcement/delete/:id
Lecture de :id
Envoie du cookie pour vérifier que l'utilisateur est bien connecté.
Aucun JSON nécéssaire.

Réponse : Message de succés.

## OAuth2 et Front

Pour consulter l'OAuth2 ainsi que le front associé à cette fonctionnalités, veuillez consulter la branche ``` frontend-auth ```.

Pour lancer le projet, veuillez suivre les étapes citées plus hauts.

Notez qu'il vous faudra également effectuer un ``` npm i ``` et un ``` npm run dev ``` dans le dossier frontend.

Une nouvelle configuration des fichiers ``` .env ``` et ``` config/key.js ``` sera également nécessaire.
