const nodemailer = require('nodemailer');
const { MailCode } = require('../database/database');
const { Op } = require('sequelize');
const consoleLog = require('../consoleLog');

// mailcode_email
const generateMailCode = async (req, res) => {
    consoleLog('• [START] controllers/controllerMailCode/generateMailCode', 'cyan');
    try {
        const { mailcode_email } = req.body;

        const mailcode_code = Math.floor(10000 + Math.random() * 90000).toString();
        consoleLog('Génération du nouveau code : \t\t' + mailcode_code, 'green');

        const mailcode_expire = new Date(Date.now() + 5 * 60 * 1000);
        consoleLog('Génération de la date d\'expiration : \t' + mailcode_expire, 'green');

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

        // Fonction pour envoyer le mail et retourner une promesse
        const sendMail = (mailOptions) => {
            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        consoleLog('Erreur lors de l\'envoi du mail : \t\t' + error, 'red');
                        reject(error);
                    } else {
                        consoleLog('Mail envoyé à : \t\t\t' + mailcode_email + ' (' + info.response + ')', 'green');
                        resolve(info);
                    }
                });
            });
        };

        // Attendre que le mail soit envoyé
        await sendMail(mailOptions);

        res.status(201).json(mailcode);
    } catch (error) {
        res.status(500).json({ error: error.message });
        consoleLog('Erreur lors de la génération du code : \t\t' + error, 'red');
    }
    
    consoleLog('• [END] controllers/controllerMailCode/generateMailCode', 'cyan');
};

// mailcode_email, mailcode_code
// MANQUE QUAND SI LE CODE EST EXPIRE ALORS ON DOIT LE SUPPRIMER
const validateMailCode = async (req, res) => {
    consoleLog('• [START] controllers/controllerMailCode/validateMailCode', 'cyan');
    try {
        const { mailcode_email, mailcode_code } = req.body;
        consoleLog('Email de validation : \t\t' + mailcode_email, 'green');
        consoleLog('Code de validation : \t\t' + mailcode_code, 'green');

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
            consoleLog('Code de validation introuvable, expiré ou déjà validé.', 'red');
            return res.status(400).json({ error: 'Code de validation introuvable, expiré ou déjà validé' });
        }

        // changer le status du code de validation
        consoleLog('Correspondance trouvée.', 'green');
        mailcode.mailcode_status = true;
        await mailcode.save();
        consoleLog('• [END] controllers/controllerMailCode/validateMailCode', 'cyan');
        return res.status(200).json({ success: true });
    } catch (error) {
        consoleLog('• [END] controllers/controllerMailCode/validateMailCode', 'cyan');
        consoleLog('Erreur lors de la validation du code : \t\t' + error, 'red');
        return res.status(500).json({ error: error.message });
    }

};

// mailcode_email
const resendMailCode = async (req, res) => {
    consoleLog('• [START] controllers/controllerMailCode/resendMailCode', 'cyan');

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

        if (mailcode) {
            consoleLog('Ancien code supprimé.', 'green');
        }

        consoleLog('Génération d\'un nouveau code.', 'green');
        await generateMailCode(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

    consoleLog('• [END] controllers/controllerMailCode/resendMailCode', 'cyan');
}

module.exports = {
    generateMailCode,
    validateMailCode,
    resendMailCode
};