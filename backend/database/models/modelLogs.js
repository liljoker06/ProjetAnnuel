module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define('Logs', {
      logs_id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      logs_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      logs_userid: {
        type: DataTypes.UUIDV4,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
      logs_acti: DataTypes.STRING,
      logs_currdate: DataTypes.DATE,
    }, {});
    Logs.associate = function(models) {
      // associations can be defined here
      Logs.belongsTo(models.User, { foreignKey: 'logs_userid' });
    };
    return Logs;
  };
  