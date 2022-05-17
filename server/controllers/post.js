import db from "../models/index.js";

const PostModal = db.posts;
const Op = db.Sequelize.Op;

const IMGAE_PATH = "/Users/olumide/Desktop/Osagie/blog/client/public/images/";
export const createPost = async (req, res) => {
  const imageFile = req.files.imageFile;
  const uploadPath = IMGAE_PATH + imageFile.name;
  //const creatorId = req.body.id;

  // Use the mv() method to place the file somewhere on your server
  const uploadProcess = new Promise((resp, rej) => {
    imageFile.mv(uploadPath, function (err) {
      if (err) return rej(err);

      resp("File uploaded!");
    });
  });
  const post = req.body;

  const newPost = new PostModal({
    ...post,
    creator: req.userId,
    imageFile: imageFile.name,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const getPosts = async (req, res) => {
  const { page } = req.query;
  console.log("here");
  try {
    const posts = await PostModal.findAll();
    console.log("here again");
    //res.status(200).json(posts);

    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await PostModal.findAndCountAll({});
    //const postss = await PostModal.findAll().limit(limit).skip(startIndex);
    res.json({
      data: posts,
      currentPage: Number(page),
      totalPosts: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModal.findByPk(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getPostsByUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const userPosts = await PostModal.findAll({
    where: { creator: id },
  });
  res.status(200).json(userPosts);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(404).json({ message: `No post exist with id: ${id}` });
    }

    await PostModal.destroy({
      where: {
        id: id,
      },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;

  const { title, description, creator, imageFile } = req.body;
  try {
    if (!id) {
      return res.status(404).json({ message: `No post exist with id: ${id}` });
    }

    // const updatedPost = {
    //   creator,
    //   title,
    //   description,

    //   imageFile,
    //   id: id,
    // };

    // // await PostModal.findByIdAndUpdate(id, updatedPost, { new: true });

    // await PostModal.update(
    //   { updatedPost: updatedPost, new: true },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );

    // res.json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostModal.findOne({ where: { title: title } });
    res.json(posts);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

// export const getRelatedPosts = async (req, res) => {
//   const tags = req.body;
//   try {
//     const posts = await PostModal.find({ tags: { $in: tags } });
//     res.json(posts);
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const likePosts = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!req.userId) {
//       return res.json({ message: "User is not authenticated" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ message: `No post exist with id: ${id}` });
//     }

//     const post = await PostModal.findById(id);

//     const index = post.likes.findIndex((id) => id === String(req.userId));

//     if (index === -1) {
//       post.likes.push(req.userId);
//     } else {
//       post.likes = post.likes.filter((id) => id !== String(req.userId));
//     }

//     const updatedPost = await PostModal.findByIdAndUpdate(id, post, {
//       new: true,
//     });

//     res.status(200).json(updatedPost);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
//};
