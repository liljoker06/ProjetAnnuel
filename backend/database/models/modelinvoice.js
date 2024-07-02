module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      invo_id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      invo_userid: {
        type: DataTypes.UUIDV4,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
      invo_compid: {
        type: DataTypes.UUIDV4,
        references: {
          model: 'Company',
          key: 'comp_id'
        }
      },
      invo_subsid: {
        type: DataTypes.UUIDV4,
        references: {
          model: 'Subscription',
          key: 'subs_id'
        }
      },
      invo_cursid: {
        type: DataTypes.UUIDV4,
        references: {
          model: 'CurrentSub',
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
  