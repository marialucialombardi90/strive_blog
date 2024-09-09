import express from "express";
import uploadCloudinary from "../middleware/cloudinaryConfigMulter.js";
import {
  listPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  updateCover,
} from "../controllers/post.controller.js";
import {
  createComment,
  listComments,
  getComment,
  deleteComment,
  editComment,
} from "../controllers/comment.controller.js";

const router = express.Router();
// routes to the posts
router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", uploadCloudinary.single("cover"), createPost);
router.put("/:id", editPost);
router.delete("/:id", deletePost);
router.patch(
  "/:blogPostId/cover",
  uploadCloudinary.single("cover"),
  updateCover
);

// routes to the comments of a single post
router.post("/:postId/comments", createComment);
router.get("/:postId/comments", listComments);
router.get("/:postId/comments/:commentId", getComment);
router.put("/:postId/comment/:commentId", editComment);
router.delete("/:postId/comment/:commentId", deleteComment);

export default router;
