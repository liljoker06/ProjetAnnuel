module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    file_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    file_userid: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    file_name: DataTypes.STRING,
    file_updat: DataTypes.DATE,
    file_modat: DataTypes.DATE,
    file_size: DataTypes.INTEGER,
    file_form: DataTypes.STRING,
    file_path: DataTypes.STRING,
  }, {});
  File.associate = function(models) {
    // associations can be defined here
    File.belongsTo(models.User, { foreignKey: 'file_userid' });
    File.hasMany(models.StorageFile, { foreignKey: 'file_id' });
  };
  return File;
};
