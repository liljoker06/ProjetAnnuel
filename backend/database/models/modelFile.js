const { sequelize, DataTypes } = require('../database'); 
const File = require('./modelFile'); 
const UserStorage = require('./modelUserStorage'); 

const StorageFile = sequelize.define('StorageFile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  file_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  stor_id: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  tableName: 'storagefiles', // Si la table a un nom spécifique
});

// Associe StorageFile à File et UserStorage
StorageFile.associate = () => {
  StorageFile.belongsTo(File, { foreignKey: 'file_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  StorageFile.belongsTo(UserStorage, { foreignKey: 'stor_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
};

module.exports = StorageFile;
