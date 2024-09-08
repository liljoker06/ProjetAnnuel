const nodemailer = require('nodemailer');
const { MailCode } = require('../database/database');
const { Op } = require('sequelize');
const consoleLog = require('../consoleLog');

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

// Fonction pour récupérer les informations de l'IP
const fetchIpData = async (ip) => {
    try {
        const url = `http://ip-api.com/json/${ip}?fields=status,message,continent,country,countryCode,regionName,city,zip`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
                return data;
            } else {
                throw new Error(data.message);
            }
        } else {
            consoleLog('Erreur de requête à l\'API IP', 'red');
            return null;
        }
    } catch (error) {
        consoleLog(`Erreur lors de la récupération des informations de l'IP : ${error}`, 'red');
        return null;
    }
};

// Fonction pour envoyer le mail et retourner une promesse
const sendMail = (email, mailContent, mailSubject) => {
    mailOptions = {
        from: 'noreply@vitruvecloud.fr',
        to: email,
        subject: mailSubject,
        html: mailContent
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                consoleLog(`Erreur lors de l'envoi du mail : ${error}`, 'red');
                reject(error);
            } else {
                consoleLog(`Mail envoyé à : \t\t\t${email} (${info.response})`, 'green');
                resolve(info);
            }
        });
    });
};

// Style du mail
const mailStyle = `
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .email-body {
            padding: 30px;
            color: #333333;
        }
        .verification-code {
            display: block;
            background-color: #e7f1ff;
            color: #007BFF;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-decoration: none;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 20px;
            background-color: #f4f4f4;
            border-top: 1px solid #dddddd;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
            text-align: left;
        }
`;

/************************************/

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

        // préparer le contenu du mail
        const mailContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification</title>
    <style>
        ${mailStyle}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Vitruve Cloud<br>Code de vérification</h1>
        </div>
        <div class="email-body">
        <a href="https://vitruvecloud.fr"><img src="https://i.imgur.com/VcWX3qk.png" alt="Vitruve Cloud" style="display: block; margin: 0 auto; width: 100px;"></a>
            <p>Bonjour,</p>
            <p>Voici votre code de vérification pour compléter votre opération sur Vitruve Cloud :</p>
            <div class="verification-code">
                ${mailcode_code}
            </div>
            <p>Veuillez entrer ce code dans l'application pour confirmer votre identité.</p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        </div>
        <div class="email-footer">
        <a href="https://vitruvecloud.fr" style="color: #007BFF; text-decoration: none;">Vitruve Cloud</a>
            <p>&copy; 2024 VitruveCloud. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>

        `;
        const mailSubject = `[${mailcode_code}] Code de vérification - Vitruve Cloud`;
        await sendMail(mailcode_email, mailContent, mailSubject);

        consoleLog('• [END] controllers/controllerMailCode/generateMailCode', 'cyan');
        res.status(201).json(mailcode);


    } catch (error) {
        consoleLog('Erreur lors de la génération du code : \t\t' + error, 'red');
        consoleLog('• [END] controllers/controllerMailCode/generateMailCode', 'cyan');
        res.status(500).json({ error: error.message });
    }
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
            consoleLog('• [END] controllers/controllerMailCode/validateMailCode', 'cyan');
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

/************************************/

// user, ip
const connexionMail = async (user, ip = null) => {

    try {
        // info de l'utilisateur
        let ipData = null;
        consoleLog(`Email de l'utilisateur : \t${user.user_email}`, 'green');

        // récupérer les informations de l'ip
        try {
            consoleLog('IP de l\'utilisateur : \t\t' + ip, 'green');
            ipData = await fetchIpData(ip);
            if (!ipData) {
                consoleLog('Aucune information trouvée sur l\'IP.', 'red');
            } else {
                consoleLog('Informations de l\'IP récupérées.', 'green');
            }
        } catch (error) {
            consoleLog(`Erreur lors de la récupération de l\'IP : ${error}`, 'red');
        }

        // envoyer un mail à l'utilisateur
        try {
            const mailContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion à Vitruve Cloud</title>
    <style>
        ${mailStyle}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Vitruve Cloud<br>Connexion</h1>
        </div>
        <div class="email-body">
            <a href="https://vitruvecloud.fr"><img src="https://i.imgur.com/VcWX3qk.png" alt="Vitruve Cloud" style="display: block; margin: 0 auto; width: 100px;"></a>
            <p>Bonjour ${user.user_fname} ${user.user_lname},</p>
            <p>Vous vous êtes connecté à Vitruve Cloud depuis l'adresse IP ${ip} (${ipData ? ipData.city + ', ' + ipData.regionName + ', ' + ipData.country : 'Localhost'}).</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, veuillez contacter notre équipe de support ou réinitialiser votre mot de passe.</p>
            <h4><a href="https://vitruvecloud.fr/resetpasswd">Réinitialiser mon mot de passe</a></h4>
            <p>Si vous êtes bien à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
            <h2><a href="https://vitruvecloud.fr" class="verification-code">Vitruve Cloud</a></h2>
        </div>
        <div class="email-footer">
        <a href="https://vitruvecloud.fr" style="color: #007BFF; text-decoration: none;">Vitruve Cloud</a>
            <p>&copy; 2024 VitruveCloud. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
            `;

            // Attendre que le mail soit envoyé
            await sendMail(user.user_email, mailContent, 'Connexion à Vitruve Cloud');
        } catch (error) {
            consoleLog(`Erreur lors de l'envoi du mail de connexion : ${error}`, 'red');
        }

    } catch (error) {
        consoleLog(`Erreur lors de l'envoi du mail de connexion : ${error}`, 'red');
    }

}

const welcomeMail = async (user, subscription, comp) => {
    try {
        const mailContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue à Vitruve Cloud</title>
            <style>
                ${mailStyle}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Vitruve Cloud<br>Bienvenue ${user.user_fname} ${user.user_lname}</h1>
                </div>
                <div class="email-body">
                    <a href="https://vitruvecloud.fr"><img src="https://i.imgur.com/VcWX3qk.png" alt="Vitruve Cloud" style="display: block; margin: 0 auto; width: 100px;"></a>
                    <p>Bienvenue ${user.user_fname} ${user.user_lname},</p>
                    <p>Nous sommes ravis d'accueillir votre entreprise <b>${comp.comp_name}</b> sur Vitruve Cloud.</p>
                    <p>Vous pouvez dès à présent profiter de nos services en vous connectant à votre compte.</p>
                    <h2><a href="https://vitruvecloud.fr" class="verification-code">Se connecter</a></h2>
                    <p>Votre facture sera disponible dans votre espace client.</p>
                    <table>
                        <tr>
                            <th>Abonnement choisi</th>
                            <td>${subscription.subs_name}</td>
                        </tr>
                        <tr>
                            <th>Prix</th>
                            <td>${subscription.subs_price} € / mois</td>
                        </tr>
                        <tr>
                            <th>Nombre d'utilisateurs</th>
                            <td>${subscription.subs_nbuser}</td>
                        </tr>
                        <tr>
                            <th>Stockage</th>
                            <td>${subscription.subs_stora} Go</td>
                        </tr>
                    </table>
                    <hr>
                    <center><h3>Vous pouvez dès à présent ajouter des utilisateurs à votre abonnement avec le code suivant :</h3></center>
                    <h2 class="verification-code">${comp.comp_code}</h2>

                    <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe de support.</p>
                </div>
                <div class="email-footer">
                <a href="https://vitruvecloud.fr" style="color: #007BFF; text-decoration: none;">Vitruve Cloud</a>
                    <p>&copy; 2024 VitruveCloud. Tous droits réservés.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Attendre que le mail soit envoyé
        await sendMail(user.user_email, mailContent, 'Bienvenue à Vitruve Cloud');
    }
    catch (error) {
        consoleLog(`Erreur lors de l'envoi du mail de bienvenue : ${error}`, 'red');
    }
}

const welcomeMail2 = async (user, subscription, company) => {
    try {
        const mailContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue à Vitruve Cloud</title>
            <style>
                ${mailStyle}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Vitruve Cloud<br>Bienvenue ${user.user_fname} ${user.user_lname}</h1>
                </div>
                <div class="email-body">
                <a href="https://vitruvecloud.fr"><img src="https://i.imgur.com/VcWX3qk.png" alt="Vitruve Cloud" style="display: block; margin: 0 auto; width: 100px;"></a>
                    <p>Bienvenue ${user.user_fname} ${user.user_lname},</p>
                    <p>Nous sommes ravis de vous accueillir sur Vitruve Cloud.</p>
                    <p>Vous nous avez rejoint à l'aide de votre entreprise <b>${company.comp_name}</b>.</p>
                    <p>Vous pouvez dès à présent profiter de nos services en vous connectant à votre compte.</p>
                    <h2><a href="https://vitruvecloud.fr" class="verification-code">Se connecter</a></h2>
                    <p>Votre facture sera disponible dans votre espace client.</p>
                    <table>
                        <tr>
                            <th>Abonnement de votre entreprise</th>
                            <td>${subscription.subs_name}</td>
                        </tr>
                        <tr>
                            <th>Votre stockage alloué</th>
                            <td>${subscription.subs_stora} Go</td>
                        </tr>
                    </table>
                    <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe de support.</p>
                </div>
                <div class="email-footer">
                <a href="https://vitruvecloud.fr" style="color: #007BFF; text-decoration: none;">Vitruve Cloud</a>
                    <p>&copy; 2024 VitruveCloud. Tous droits réservés.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Attendre que le mail soit envoyé
        await sendMail(user.user_email, mailContent, 'Bienvenue à Vitruve Cloud');
    }
    catch (error) {
        consoleLog(`Erreur lors de l'envoi du mail de bienvenue : ${error}`, 'red');
    }
}


module.exports = {
    generateMailCode,
    validateMailCode,
    resendMailCode,
    connexionMail,
    welcomeMail,
    welcomeMail2
};