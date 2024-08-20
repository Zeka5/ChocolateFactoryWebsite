const express = require("express");
const router = express.Router();

const ChocolateDao = require("../Dao/ChocolateDao");
const chocolateDao = new ChocolateDao();
const Chocolate = require("../Model/Chocolate.js");

router.get("/", (req, res) => {
  const chocolates = chocolateDao.getAll();
  return res.json(chocolates);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const chocolate = chocolateDao.getById(id);

  if (!chocolate) {
    return res.status(404).json({ error: "Chocolate not found" });
  }
  return res.json(chocolate);
});

router.post("/", (req, res) => {
  const {
    name,
    price,
    kind,
    factoryId,
    type,
    weight,
    description,
    image,
    status,
    quantity,
  } = req.body;

  const newChocolate = new Chocolate(
    null,
    name,
    price,
    kind,
    factoryId,
    type,
    weight,
    description,
    image,
    status,
    quantity
  );

  const addedChocolate = chocolateDao.add(newChocolate);
  return res.json({
    message: "Chocolate added successfully",
    chocolate: addedChocolate,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedChocolate = chocolateDao.update(updatedData);
  if (!updatedChocolate) {
    return res.status(404).json({ error: "Chocolate not found" });
  }
  return res.json({
    message: "Chocolate updated successfully",
    chocolate: updatedChocolate,
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedChocolate = chocolateDao.delete(id);
  if (!deletedChocolate) {
    return res.status(404).json({ error: "Chocolate not found" });
  }
  return res.json({
    message: "Chocolate deleted successfully",
    chocolate: deletedChocolate,
  });
});

module.exports = router;
