const fs = require("fs");
const path = require("path");
const OrderCancellation = require("../Model/OrderCancellation");

class OrderCancellationDao {
  constructor() {
    this.filePath = path.join(
      __dirname,
      "..",
      "Database/orderCancellations.json"
    );
    this.orderCancellations = this.loadOrderCancellations();
  }

  loadOrderCancellations() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((orderCancellation) =>
        OrderCancellation.fromJSON(orderCancellation)
      );
    }
    return [];
  }

  checkIfUserIsSuspicious(username, cancellations) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let cancellationCount = 0;

    for (const order of this.orderCancellations) {
      if (order.username === username && new Date(order.date) >= oneMonthAgo) {
        cancellationCount++;
        if (cancellationCount >= 5) {
          return true;
        }
      }
    }

    return false;
  }

  getAll() {
    return this.orderCancellations;
  }

  save() {
    const json = this.orderCancellations.map((orderCancellation) =>
      orderCancellation.toJSON()
    );
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  //   update(updatedOrderCancellation) {
  //     const id = updatedOrderCancellation.id;
  //     if (!id) {
  //       throw new Error("ID is required to update a order cancellation");
  //     }
  //     const index = this.orderCancellations.findIndex(
  //       (orderCancellation) => orderCancellation.id === id
  //     );
  //     if (index === -1) {
  //       return null;
  //     }

  //     const existingOrderCancellation = this.orderCancellations[index];

  //     this.orderCancellations[index] = new OrderCancellation(
  //       existingOrderCancellation.id,
  //       updatedOrderCancellation.username || existingOrderCancellation.username,
  //       updatedOrderCancellation.factoryId || existingOrderCancellation.factoryId,
  //       updatedOrderCancellation.date || existingOrderCancellation.date
  //     );

  //     this.save();
  //     return this.orderCancellations[index];
  //   }

  add(orderCancellation) {
    const id =
      this.orderCancellations.length > 0
        ? this.orderCancellations[this.orderCancellations.length - 1].id + 1
        : 1;
    orderCancellation.id = id;
    this.orderCancellations.push(orderCancellation);
    this.save();
    return orderCancellation;
  }
}

module.exports = OrderCancellationDao;
