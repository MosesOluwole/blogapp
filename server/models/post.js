export default (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    creator: {
      type: Sequelize.STRING,
    },
    imageFile: {
      type: Sequelize.STRING,
    },
    tags: {
      type: Sequelize.STRING,
      value: [],
    },
  });
  return Post;
};
