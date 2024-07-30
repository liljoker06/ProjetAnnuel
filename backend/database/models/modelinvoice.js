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
      invo_ttc: DataTypes.FLOAT,
      invo_metho: DataTypes.STRING,
      invo_desc: DataTypes.TEXT,
    }, {});
    Invoice.associate = function(models) {
      // associations can be defined here
      Invoice.belongsTo(models.User, { foreignKey: 'invo_userid' });
      Invoice.belongsTo(models.Company, { foreignKey: 'invo_compid' });
      Invoice.belongsTo(models.Subscription, { foreignKey: 'invo_subsid' });
      Invoice.belongsTo(models.CurrentSub, { foreignKey: 'invo_cursid' });
    };
    return Invoice;
  };
  