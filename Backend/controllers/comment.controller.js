import Comment from "../models/commentSchema.js";

export const createComment = async (req, res) => {
  const postId = req.params.postId;
  const commentInfo = req.body;
  try {
    const newComment = new Comment({ ...commentInfo, post: postId });
    const createdComment = await newComment.save();

    res.status(200).send(createdComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("post", { title: 1, _id: 0 })
      .populate("author");
    res.send({
      data: comments,
    });
  } catch (error) {
    console.log(error);

    res.status(404).send({ message: "Not Found" });
  }
};

export const getComment = async (req, res) => {
  try {
    const singleComment = await Comment.findOne({
      post: req.params.postId,
      _id: req.params.commentId,
    }).populate("author");
    return res.status(200).send(singleComment);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Not Found" });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await Comment.exists({ _id: req.params.commentId });
    if (comment) {
      const singleComment = await Comment.findOneAndUpdate(
        { post: req.params.postId, _id: req.params.commentId },
        { $set: req.body },
        { new: true }
      );
      return res.status(200).send(singleComment);
    } else {
      return res.status(404).send({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    //verifi that the comment exitst
    const comment = await Comment.exists({ _id: req.params.commentId });
    if (comment) {
      const singleComment = await Comment.findOneAndDelete({
        post: req.params.postId,
        _id: req.params.commentId,
      });
      return res.status(200).send({
        message: `Comment deleted successfully: ${req.params.commentId}`,
      });
    } else {
      return res.status(404).send({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
