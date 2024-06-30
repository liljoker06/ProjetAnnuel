module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      subs_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
      subs_name: DataTypes.STRING,
      subs_stora: DataTypes.INTEGER,
      subs_price: DataTypes.FLOAT,
    }, {});
    Subscription.associate = function(models) {
      // associations can be defined here
      Subscription.hasMany(models.User, { foreignKey: 'user_subid' });
      Subscription.hasMany(models.CurrentSub, { foreignKey: 'curs_subsid' });
    };
    return Subscription;
  };
  