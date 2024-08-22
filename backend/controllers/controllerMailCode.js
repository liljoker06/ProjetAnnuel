const nodemailer = require('nodemailer');
const { MailCode } = require('../database/database');

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
// MANQUE QUAND SI LE CODE EST E
const validateMailCode = async (req, res) => {
    try {
        const { mailcode_email, mailcode_code } = req.body;

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

        if (!mailcode) {
            return res.status(400).json({ error: 'Invalid mail code' });
        }

        mailcode.mailcode_status = true;
        await mailcode.save();

        res.status(200).json(mailcode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// mailcode_email
const resendMailCode = async (req, res) => {
    try {
        const { mailcode_email } = req.body;

        const mailcode = await MailCode.delete({
            where: {
                mailcode_email,
                mailcode_status: false,
                mailcode_expire: {
                    [Op.gt]: new Date()
                }
            }
        });

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