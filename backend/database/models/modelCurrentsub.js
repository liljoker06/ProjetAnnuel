module.exports = (sequelize, DataTypes) => {
  const CurrentSub = sequelize.define('CurrentSub', {
    curs_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    curs_userid: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    curs_subsid: {
      type: DataTypes.UUID,
      references: {
        model: 'Subscription',
        key: 'subs_id'
      }
    },
    curs_start: DataTypes.DATE,
    curs_end: DataTypes.DATE,
  }, {});

  CurrentSub.associate = function(models) {
    CurrentSub.belongsTo(models.User, { foreignKey: 'curs_userid' });
    CurrentSub.belongsTo(models.Subscription, { foreignKey: 'curs_subsid' });
    CurrentSub.hasMany(models.Invoice, { foreignKey: 'invo_cursid' });
  };

  return CurrentSub;
};
