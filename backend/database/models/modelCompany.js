module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    comp_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    comp_subsid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Subscriptions', // Nom de la table des abonnements
        key: 'subs_id',
      },
    },
  }, {});

  Company.associate = function(models) {
    Company.hasMany(models.UserCompany, { foreignKey: 'comp_id' });
    Company.belongsTo(models.Subscription, { foreignKey: 'comp_subsid' });
  };

  return Company;
};