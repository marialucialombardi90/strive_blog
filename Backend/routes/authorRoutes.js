import express, { json } from "express";
import AuthorR from "../models/authorsSchema.js";
import uploadCloudinary from "../middleware/cloudinaryConfigMulter.js";
import {
  getAuthors,
  getSingleAuthor,
  addAuthor,
  editAuthor,
  deleteAuthor,
  patchAuthor,
  getSingleAuthorPosts,
} from "../controllers/author.controller.js";

const router = express.Router();

router.get("/", getAuthors);
router.get("/:id", getSingleAuthor);
router.post("/", addAuthor);
router.put("/:id", editAuthor);
router.delete("/:id", deleteAuthor);
router.patch(
  "/:authorId/avatar",
  uploadCloudinary.single("avatar"),
  patchAuthor
);
router.get("/:id/blogPosts", getSingleAuthorPosts);

export default router;
