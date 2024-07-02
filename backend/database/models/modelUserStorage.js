module.exports = (sequelize, DataTypes) => {
    const UserStorage = sequelize.define('UserStorage', {
      stor_id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUIDV4,
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
  