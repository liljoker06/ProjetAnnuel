// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./database/database'); 
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

// Utiliser les routes
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: true }); // alter: true met à jour la structure des tables pour correspondre aux modèles

    console.log('Database synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
