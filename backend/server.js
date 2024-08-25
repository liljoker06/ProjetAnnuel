const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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

const app = express();
app.use(bodyParser.json());
app.use(cors());
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

const PORT = 5555;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Synchroniser les modèles avec la base de données dans le bon ordre


    // await sequelize.sync({ alter: true }); 

    await Company.sync({ alter: true });
    await Subscription.sync({ alter: true });
    await User.sync({ alter: true });
    await UserCompany.sync({ alter: true });
    await Logs.sync({ alter: true });
    await CurrentSub.sync({ alter: true });
    await Invoice.sync({ alter: true });
    await File.sync({ alter: true });
    await UserStorage.sync({ alter: true });
    await StorageFile.sync({ alter: true });
    await MailCode.sync({ alter: true });

    console.log('Database synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


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