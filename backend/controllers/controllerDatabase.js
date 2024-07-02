const sequelize = require('../database/database');

const { Logs } = require('../database/models/modelLogs');
const { User } = require('../database/models/modelUser');
const { Company } = require('../database/models/modelCompany');
const { UserCompany } = require('../database/models/modelUserCompany');
const { UserStorage } = require('../database/models/modelUserStorage');
const { StorageFile } = require('../database/models/modelStorageFile');
const { Subscription } = require('../database/models/modelSubscription');
const { File } = require('../database/models/modelFile');
const { CurrentSub } = require('../database/models/modelCurrentSub');
const { Invoice } = require('../database/models/modelInvoice');

exports.AllTable = async (req, res) => {
await sequelize.query('CREATE DATABASE IF NOT EXISTS `vproject`')
}