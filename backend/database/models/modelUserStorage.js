module.exports = (sequelize, DataTypes) => {
    const UserStorage = sequelize.define('UserStorage', {
      stor_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
    }, {});
    UserStorage.associate = function(models) {
      // associations can be defined here
      UserStorage.belongsTo(models.User, { foreignKey: 'user_id' });
      UserStorage.hasMany(models.StorageFile, { foreignKey: 'stor_id' });
    };
    return UserStorage;
  };
  