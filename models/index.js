const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Bdcard = require('./bdcard')(sequelize, Sequelize);
db.Reqboard = require('./reqboard')(sequelize, Sequelize);

// 사용자와 헌혈증 관계 형성(1:n)
db.User.hasMany(db.Bdcard, {foreignKey: 'owner_id', sourceKey: 'user_id'});
db.Bdcard.belongsTo(db.User, {foreignKey: 'owner_id', targetKey: 'user_id'});

// 사용자와 기부요청 관계 형성(1:n)
db.User.hasMany(db.Reqboard, {foreignKey: 'req_user_id', sourceKey: 'user_id'});
db.Reqboard.belongsTo(db.User, {foreignKey: 'req_user_id', targetKey: 'user_id'});

// 기부요청과 헌혈증 관계 형성(1:n)
db.Reqboard.hasMany(db.Bdcard, {foreignKey: 'donated_req_id', sourceKey: 'id'});  //id : reqboard의 primary key
db.Bdcard.belongsTo(db.Reqboard, {foreignKey: 'donated_req_id', targetKey: 'id'});

module.exports = db;
