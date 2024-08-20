const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const chocolateRoute = require("./Server/ChocolateServer");
const chocolateFactoryRoute = require("./Server/ChocolateFactoryServer");
const usersRoute = require("./Server/UserServer");
const cartsRoute = require("./Server/CartServer");
const purchaseRoute = require("./Server/PurchaseServer");
const commentRoute = require("./Server/CommentServer");
const orderCancellationRoute = require("./Server/OrderCancellationServer");

app.use("/chocolates", chocolateRoute);
app.use("/factories", chocolateFactoryRoute);
app.use("/users", usersRoute);
app.use("/carts", cartsRoute);
app.use("/purchases", purchaseRoute);
app.use("/comments", commentRoute);
app.use("/orderCancellation", orderCancellationRoute);

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log("Server is running on port:", port);
  }
});
