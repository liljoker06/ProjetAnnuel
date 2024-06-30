module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      comp_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      comp_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comp_addre: DataTypes.STRING,
      comp_posta: DataTypes.INTEGER,
      comp_city: DataTypes.STRING,
      comp_siret: DataTypes.STRING,
      comp_code: DataTypes.STRING,
    }, {});
    Company.associate = function(models) {
      // associations can be defined here
      Company.hasMany(models.UserCompany, { foreignKey: 'comp_id' });
    };
    return Company;
  };
  