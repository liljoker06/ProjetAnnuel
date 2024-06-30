module.exports = (sequelize, DataTypes) => {
    const UserCompany = sequelize.define('UserCompany', {
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
      comp_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Company',
          key: 'comp_id'
        }
      },
    }, {});
    UserCompany.associate = function(models) {
      // associations can be defined here
      UserCompany.belongsTo(models.User, { foreignKey: 'user_id' });
      UserCompany.belongsTo(models.Company, { foreignKey: 'comp_id' });
    };
    return UserCompany;
  };
  