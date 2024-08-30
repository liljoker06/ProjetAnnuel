module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    user_role: 
    {
      type : DataTypes.ENUM('client', 'admin'),
      defaultValue: 'client',
    },
    user_date: DataTypes.DATEONLY,
    user_valid: 
    {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_subid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Subscriptions',
        key: 'subs_id'
      }
    },
  }, {});

  User.associate = function(models) {
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
