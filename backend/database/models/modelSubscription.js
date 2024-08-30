module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    subs_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    subs_name: DataTypes.STRING,
    subs_stora: DataTypes.INTEGER,
    subs_price: DataTypes.FLOAT,
    subs_nbuser: DataTypes.INTEGER,
  }, {});

  Subscription.associate = function(models) {
    Subscription.hasMany(models.User, { foreignKey: 'user_subid' });
    Subscription.hasMany(models.CurrentSub, { foreignKey: 'curs_subsid' });
  };

  return Subscription;
};
