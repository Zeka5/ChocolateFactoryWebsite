class OrderCancellation {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.date = this.formatDate(new Date());
  }

  static fromJSON(json) {
    const { id, username, date } = json;
    return new OrderCancellation(id, username, date);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      date: this.date,
    };
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

module.exports = OrderCancellation;
