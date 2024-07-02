module.exports = (sequelize, DataTypes) => {
    const StorageFile = sequelize.define('StorageFile', {
      file_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: 'Files',
          key: 'file_id'
        }
      },
      stor_id: {
        type: DataTypes.UUID,
        references: {
          model: 'UserStorages',
          key: 'stor_id'
        }
      },
    }, {});
    StorageFile.associate = function(models) {
      // associations can be defined here
      StorageFile.belongsTo(models.File, { foreignKey: 'file_id' });
      StorageFile.belongsTo(models.UserStorage, { foreignKey: 'stor_id' });
    };
    return StorageFile;
  };
  