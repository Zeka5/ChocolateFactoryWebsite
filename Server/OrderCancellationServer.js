const express = require("express");
const router = express.Router();

const OrderCancellationDao = require("../Dao/OrderCancellationDao");
const orderCancellationDao = new OrderCancellationDao();
const OrderCancellation = require("../Model/OrderCancellation");

const UserDao = require("../Dao/UserDao");
const userDao = new UserDao();

router.get("/", (req, res) => {
  const orderCancellations = orderCancellationDao.getAll();
  return res.json(orderCancellations);
});

router.get("/isSuspicious/:username", (req, res) => {
  const isSuspicious = Boolean(
    orderCancellationDao.checkIfUserIsSuspicious(req.params.username)
  );

  if (isSuspicious) {
    userDao.setToSuspicious(req.params.username);
  }

  return res.json(isSuspicious);
});

router.post("/", (req, res) => {
  const { username, date } = req.body;
  const newOrderCancellation = new OrderCancellation(null, username, date);

  const addedOrderCancellation = orderCancellationDao.add(newOrderCancellation);
  return res.json({
    message: "Order cancellation successfully added!",
    orderCancellation: addedOrderCancellation,
  });
});

module.exports = router;
