module.exports = (sequelize, DataTypes) => {
    const MailCode = sequelize.define('MailCode', {
        mailcode_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        mailcode_code: DataTypes.STRING,
        mailcode_email: DataTypes.STRING,
        mailcode_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        mailcode_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        mailcode_expire: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {});

    return MailCode;
}