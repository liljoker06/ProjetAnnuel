module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    invo_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    invo_userid: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    invo_compid: {
      type: DataTypes.UUID,
      references: {
        model: 'Companies',
        key: 'comp_id'
      }
    },
    invo_subsid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Subscriptions',
        key: 'subs_id'
      }
    },
    invo_cursid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CurrentSubs',
        key: 'curs_id'
      }
    },
    invo_tva: DataTypes.INTEGER,
  }, {});

  Invoice.associate = function(models) {
    // associations can be defined here
    Invoice.belongsTo(models.User, { foreignKey: 'invo_userid' });
    Invoice.belongsTo(models.Company, { foreignKey: 'invo_compid' });
    Invoice.belongsTo(models.Subscription, { foreignKey: 'invo_subsid' });
    Invoice.belongsTo(models.CurrentSub, { foreignKey: 'invo_cursid' });

    // Adding a virtual field to get the price from the Subscription model
    Invoice.addScope('defaultScope', {
      include: [
        {
          model: models.Subscription,
          attributes: ['subs_price', 'subs_name', 'subs_stora', 'subs_nbuser', 'createdAt']
        },
        {
          model: models.Company,
          attributes: ['comp_name', 'comp_addre', 'comp_posta', 'comp_city', 'comp_siret']
        },
        {
          model: models.User,
          attributes: ['user_id', 'user_fname', 'user_lname', 'user_email']
        }
      ]
    }, { override: true });
  };

  return Invoice;
};