const fs = require("fs");
const path = require("path");
const Comment = require("../Model/Comment");

class CommentDao {
  constructor() {
    this.filePath = path.join(__dirname, "..", "Database/comments.json");
    this.comments = this.loadComments();
  }

  loadComments() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((comment) => Comment.fromJson(comment));
    }
    return [];
  }

  getAll() {
    return this.comments;
  }

  getAllAccepted(factoryId) {
    return this.comments.filter(
      (comment) =>
        comment.status === "Accepted" && comment.factoryId === factoryId
    );
  }

  save() {
    const json = this.comments.map((comment) => comment.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  update(updatedComment) {
    const id = updatedComment.id;
    if (!id) {
      throw new Error("ID is required to update a comment");
    }
    const index = this.comments.findIndex((comment) => comment.id === id);
    if (index === -1) {
      return null;
    }

    const existingComment = this.comments[index];

    this.comments[index] = new Comment(
      existingComment.id,
      existingComment.username,
      existingComment.factoryId,
      existingComment.text,
      existingComment.rating,
      updatedComment.status
    );

    this.save();
    return this.comments[index];
  }

  add(comment) {
    const id =
      this.comments.length > 0
        ? this.comments[this.comments.length - 1].id + 1
        : 1;
    comment.id = id;
    this.comments.push(comment);
    this.save();
    return comment;
  }
}

module.exports = CommentDao;
