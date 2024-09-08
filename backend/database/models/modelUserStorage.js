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
      allowNull: false,
      references: {
        model: 'Users',  // Assurez-vous que le nom correspond exactement à celui dans la base de données
        key: 'user_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    used_storage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    dispo_storage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    subs_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subscriptions',  // Assurez-vous que le nom correspond exactement à celui dans la base de données
        key: 'subs_id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  }, {});

  UserStorage.associate = function(models) {
    UserStorage.belongsTo(models.User, { foreignKey: 'user_id' });
    UserStorage.belongsTo(models.Subscription, { foreignKey: 'subs_id' });
  };

  return UserStorage;
};
