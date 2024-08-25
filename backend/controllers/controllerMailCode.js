const nodemailer = require('nodemailer');
const { MailCode } = require('../database/database');
const { Op } = require('sequelize');

// mailcode_email
const generateMailCode = async (req, res) => {
    try {
        const { mailcode_email } = req.body;

        const mailcode_code = Math.floor(10000 + Math.random() * 90000).toString();

        const mailcode_expire = new Date(Date.now() + 5 * 60 * 1000);

        const mailcode = await MailCode.create({
            mailcode_email,
            mailcode_code,
            mailcode_expire
        });

        const transporter = nodemailer.createTransport({
            host: 'mail.vitruvecloud.fr',
            port: 587,
            secure: false,
            auth: {
                user: 'noreply@vitruvecloud.fr',
                pass: 'xB2!Y_8H9G2znTq'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'noreply@vitruvecloud.fr',
            to: mailcode_email,
            subject: 'Code de vérification - Vitruve Cloud',
            text: `Votre code de vérification est : ${mailcode_code}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        res.status(201).json(mailcode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// mailcode_email, mailcode_code
// MANQUE QUAND SI LE CODE EST EXPIRE ALORS ON DOIT LE SUPPRIMER
const validateMailCode = async (req, res) => {
    try {
        console.log('Requête reçue:', req.body);
        const { mailcode_email, mailcode_code } = req.body;

        console.log('Recherche du code de validation...');
        const mailcode = await MailCode.findOne({
            where: {
                mailcode_email,
                mailcode_code,
                mailcode_status: false,
                mailcode_expire: {
                    [Op.gt]: new Date()
                }
            }
        });

        // si le code de validation n'existe pas
        if (!mailcode) {
            console.log('Code de validation invalide ou expiré.');
            return res.status(400).json({ error: 'Code de validation invalide ou expiré' });
        }

        // changer le status du code de validation
        console.log('Code de validation trouvé:', mailcode);
        mailcode.mailcode_status = true;
        await mailcode.save();
        console.log('Code de validation mis à jour et sauvegardé.');
        console.log('Envoi de la réponse avec statut 200...');
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la validation du code:', error);
        return res.status(500).json({ error: error.message });
    }
};

// mailcode_email
const resendMailCode = async (req, res) => {
    try {
        const { mailcode_email } = req.body;

        const mailcode = await MailCode.destroy({
            where: {
                mailcode_email,
                mailcode_status: false,
                mailcode_expire: {
                    [Op.gt]: new Date()
                }
            }
        });

        console.log("Le code a été supprimé");
        console.log("génération d'un nouveau code");
        generateMailCode(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    generateMailCode,
    validateMailCode,
    resendMailCode
};