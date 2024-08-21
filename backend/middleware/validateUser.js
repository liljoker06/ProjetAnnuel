const {body} = require('express-validator');

const validateUser = [
    body('email').isEmail().withMessage('veuilez entrer une adresse email Valide'),
    body('password').isLength({min: 6}).withMessage('le mot de passe doit contenir au moins 6 caractères')
];

module.exports = validateUser;