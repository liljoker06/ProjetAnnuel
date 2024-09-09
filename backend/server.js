const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Op } = require('sequelize');
const { sequelize, Company, Subscription, User, UserCompany, Logs, CurrentSub, Invoice, File, UserStorage, StorageFile, MailCode } = require('./database/database');

const companyRoute = require('./routes/companyRoute');
const userRoute = require('./routes/userRoute');
const userCompanyRoute = require('./routes/userCompanyRoute');
const logsRoute = require('./routes/logsRoute');
const fileRoute = require('./routes/fileRoute');
const userStorageRoute = require('./routes/userStrorageRoute');
const storageFileRoute = require('./routes/storageFileRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const currentSubRoute = require('./routes/currentSubRoute');
const mailCodeRoute = require('./routes/mailCodeRoute');
const adminRoute = require('./routes/adminRoute/adminRoute');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL, //l'URL  front-end
    credentials: true // Permet l'envoi et la réception des cookies
}));
app.use(express.json());

app.use('/api/companies', companyRoute);
app.use('/api/users', userRoute);
app.use('/api/userCompanies', userCompanyRoute);
app.use('/api/logs', logsRoute);
app.use('/api/files', fileRoute);
app.use('/api/userStorages', userStorageRoute);
app.use('/api/storageFiles', storageFileRoute);
app.use('/api/invoices', invoiceRoute);
app.use('/api/subscriptions', subscriptionRoute);
app.use('/api/currentSubs', currentSubRoute);
app.use('/api/mailCodes', mailCodeRoute);
app.use('/api/admin', adminRoute);

const PORT = 5555;

// Insertion des abonnements par défaut
const insertDefaultSubscriptions = async () => {
    const defaultSubscriptions = [
        { subs_name: 'Basique', subs_stora: 2, subs_price: 9, subs_nbuser: 10 },
        { subs_name: 'Pro', subs_stora: 20, subs_price: 49, subs_nbuser: 100 },
        { subs_name: 'Business', subs_stora: 1000, subs_price: 99, subs_nbuser: 1000 },
    ];

    for (const subscription of defaultSubscriptions) {
        await Subscription.findOrCreate({
            where: { subs_name: subscription.subs_name },
            defaults: subscription,
        });
    }
};

// // Insertion des données pour le développement
// const insertForDev = async () => {
//     const defaultCompanies = [
//         { comp_name: 'test', comp_siret: '12345678901234', comp_code: '1234567890' },
//     ];
//     const defaultUsers = [
//         { user_fname: 'test', user_lname: 'test', user_email: 'matisagr@gmail.com', user_passw: '$2y$10$59Iz8v.Bo0IkFfMOcgLs..brpaSS8T/o0.fhRtobDYx5eV4YYX61u', user_addre: 'test', user_posta: 12345, user_city: 'test', user_phone: 'test', user_role: 1, user_subid: 1 },
//     ];

//     for (const company of defaultCompanies) {
//         await Company.findOrCreate({
//             where: { comp_name: company.comp_name },
//             defaults: company,
//         });
//     }

//     for (const user of defaultUsers) {
//         await User.findOrCreate({
//             where: { user_email: user.user_email },
//             defaults: user,
//         });
//     }
// };



app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // reset la base de données à chaque démarrage avec force: true
        await sequelize.sync({ alter: true });

        // await Company.sync({ alter: true, force: true });
        // await Subscription.sync({ alter: true, force: true });
        // await User.sync({ alter: true, force: true });
        // await UserCompany.sync({ alter: true, force: true });
        // await Logs.sync({ alter: true, force: true });
        // await CurrentSub.sync({ alter: true, force: true });
        // await Invoice.sync({ alter: true, force: true });
        // await File.sync({ alter: true, force: true });
        // await UserStorage.sync({ alter: true, force: true });
        // await StorageFile.sync({ alter: true, force: true });
        // await MailCode.sync({ alter: true, force: true });

        // Insertion des données
        await insertDefaultSubscriptions();
        // await insertForDev();
        console.log('Database synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    /********************************************************************************/

    // Vider les codes de validation expirés toutes les 1h
    setInterval(async () => {
        try {
            const mailcodes = await MailCode.destroy({
                where: {
                    mailcode_expire: {
                        [Op.lt]: new Date()
                    }
                }
            });

            if (mailcodes > 0) {
                console.log(`Les codes de validation expirés ont été supprimés: ${mailcodes} codes supprimés`);
            } else {
                console.log('Aucun code de validation expiré à supprimer');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression des codes de validation expirés:', error);
        }
    }, 3600000); // 3600000ms = 1h



});