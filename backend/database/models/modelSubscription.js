module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    subs_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    subs_name: DataTypes.STRING,
    subs_stora: DataTypes.INTEGER,
    subs_price: DataTypes.FLOAT,
  }, {});

  Subscription.associate = function(models) {
    Subscription.hasMany(models.User, { foreignKey: 'user_subid' });
    Subscription.hasMany(models.CurrentSub, { foreignKey: 'curs_subsid' });
  };

  return Subscription;
};
