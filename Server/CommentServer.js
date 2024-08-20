const express = require("express");
const router = express.Router();

const CommentDAO = require("../Dao/CommentDao");
const commentDao = new CommentDAO();
const Comment = require("../Model/Comment");

router.get("/", (req, res) => {
  const comments = commentDao.getAll();
  console.log(comments);
  return res.json(comments);
});

router.get("/accepted/:factoryId", (req, res) => {
  const comments = commentDao.getAllAccepted(req.params.factoryId);
  return res.json(comments);
});

router.post("/", (req, res) => {
  const { username, factoryId, text, rating, status } = req.body;
  const newComment = new Comment(
    null,
    username,
    factoryId,
    text,
    rating,
    status
  );

  const addedComment = commentDao.add(newComment);
  return res.json({
    message: "Comment successfully added!",
    comment: addedComment,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedUser = commentDao.update(updatedData);
  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

module.exports = router;
