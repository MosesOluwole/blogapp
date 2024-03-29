export default (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    firstname: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    mfaSecret: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
