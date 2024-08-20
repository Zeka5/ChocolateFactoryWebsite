const express = require("express");
const router = express.Router();

const PurchaseDao = require("../Dao/PurchaseDao");
const purchaseDao = new PurchaseDao();
const Purchase = require("../Model/Purchase");

router.get("/", (req, res) => {
  const purchases = purchaseDao.getAll();
  return res.json(purchases);
});

router.get("/:factoryId", (req, res) => {
  const factoryId = Number(req.params.factoryId);
  const purchases = purchaseDao.getByFactoryId(factoryId);

  if (!purchases || purchases.length === 0) {
    return res
      .status(404)
      .json({ error: "No purchases from that factory found" });
  }
  return res.json(purchases);
});

router.get("/customer/:factoryId", (req, res) => {
  const factoryId = Number(req.params.factoryId);
  const customers = purchaseDao.getCustomersByFactoryId(factoryId);

  if (!customers || customers.length === 0) {
    return res
      .status(404)
      .json({ error: "No customers from that factory found" });
  }
  return res.json(customers);
});

router.get("/status/:status", (req, res) => {
  const status = req.params.status;
  const purchases = purchaseDao.getByStatus(status);

  if (!purchases || purchases.length === 0) {
    return res
      .status(404)
      .json({ error: "No purchases with that status found" });
  }
  return res.json(purchases);
});

router.post("/", (req, res) => {
  const { chocolates, factoryId, customerName, status } = req.body;
  const newPurchase = new Purchase(chocolates, factoryId, customerName, status);

  const addedPurchase = purchaseDao.add(newPurchase);
  return res.json({
    message: "Purchase added successfully",
    purchase: addedPurchase,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedPurchase = purchaseDao.update(updatedData);
  if (!updatedPurchase) {
    return res.status(404).json({ error: "Purchase not found" });
  }
  return res.json({
    message: "Purchase updated successfully",
    purchase: updatedPurchase,
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const deletedPurchase = purchaseDao.delete(id);
  if (!deletedPurchase) {
    return res.status(404).json({ error: "Purchase not found" });
  }
  return res.json({
    message: "Purchase deleted successfully",
    purchase: deletedPurchase,
  });
});

module.exports = router;
