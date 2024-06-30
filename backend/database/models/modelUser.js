module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      user_fname: DataTypes.STRING,
      user_lname: DataTypes.STRING,
      user_email: {
        type: DataTypes.STRING,
        unique: true,
      },
      user_passw: DataTypes.STRING,
      user_addre: DataTypes.STRING,
      user_posta: DataTypes.INTEGER,
      user_city: DataTypes.STRING,
      user_phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      user_role: DataTypes.ENUM('client', 'superadmin'),
      user_date: DataTypes.DATE,
      user_valid: DataTypes.BOOLEAN,
      user_subid: {
        type: DataTypes.UUID,
        references: {
          model: 'Subscription',
          key: 'subs_id'
        }
      },
    }, {});
    User.associate = function(models) {
      // associations can be defined here
      User.belongsTo(models.Subscription, { foreignKey: 'user_subid' });
      User.hasMany(models.Logs, { foreignKey: 'logs_userid' });
      User.hasMany(models.UserCompany, { foreignKey: 'user_id' });
      User.hasMany(models.Invoice, { foreignKey: 'invo_userid' });
      User.hasMany(models.CurrentSub, { foreignKey: 'curs_userid' });
      User.hasMany(models.File, { foreignKey: 'file_userid' });
      User.hasMany(models.UserStorage, { foreignKey: 'user_id' });
    };
    return User;
  };
  