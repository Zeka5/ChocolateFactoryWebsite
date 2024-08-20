class Comment {
  constructor(id, username, factoryId, text, rating, status) {
    this.id = id;
    this.username = username;
    this.factoryId = factoryId;
    this.text = text;
    this.rating = rating;
    this.status = status;
  }

  static fromJson(json) {
    const { id, username, factoryId, text, rating, status } = json;
    return new Comment(id, username, factoryId, text, rating, status);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      factoryId: this.factoryId,
      text: this.text,
      rating: this.rating,
      status: this.status,
    };
  }
}

module.exports = Comment;
