import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsBySearch,
  getPostsByUser,
  updatePost,
} from "../controllers/post.js";
router.post("/", auth, createPost);
router.get("/search", getPostsBySearch);

router.get("/", getPosts);
router.get("/:id", getPost);
router.delete("/:id", auth, deletePost);
router.put("/:id", auth, updatePost);
router.get("/userPosts/:id", auth, getPostsByUser);

export default router;
