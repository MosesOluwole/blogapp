const db = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "password12345",
  DB: "blog_app",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
export default db;
