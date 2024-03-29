import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import users from "./user.js";
import posts from "./post.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = users(sequelize, Sequelize);
db.posts = posts(sequelize, Sequelize);
export default db;
