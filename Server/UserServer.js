//require('dotenv').config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authMiddleware");
const bcrypt = require("bcrypt");

const UserDAO = require("../Dao/UserDao");
const userDAO = new UserDAO();

const PurchaseDao = require("../Dao/PurchaseDao.js");
const purchaseDao = new PurchaseDao();

const User = require("../Model/User.js");

const SECRET_KEY =
  "a30b0e3a1fd57f407f61884e99ce60612b248a8aa3c5a015452e5b79c06fadbf6a3666d7396c3d33dac7bf766ab8f64c28579eb023ac7b9904fd8f4f27fa948b";

router.get("/", (req, res) => {
  const users = userDAO.getAll();
  return res.json(users);
});

router.get("/suspiciousUsers", (req, res) => {
  const users = userDAO.getAllSuspicious();
  return res.json(users);
});

router.get("/blockedUsers", (req, res) => {
  const users = userDAO.getAllBlocked();
  return res.json(users);
});

router.get("/filter", (req, res) => {
  const { role } = req.query;

  if (role === "none") {
    return res.json(userDAO.getAll());
  }

  const retVal = userDAO.filter(role);
  return res.json(retVal);
});

router.get("/filterByCustomerType", (req, res) => {
  const { customerType } = req.query;

  if (customerType === "none") {
    return res.json(userDAO.getAll());
  }

  const retVal = userDAO.filterByCustomerType(customerType);
  return res.json(retVal);
});

router.get("/search", (req, res) => {
  const { users, username, firstName, lastName } = req.query;
  const searched = userDAO.getBySearchParameters(
    users,
    username,
    firstName,
    lastName
  );
  return res.json(searched);
});

router.get("/sort", (req, res) => {
  if (req.query.sortBy === "none") {
    return res.json(userDAO.getAll());
  }

  const sorted = userDAO.getSorted(req.query.sortBy, req.query.users);
  return res.json(sorted);
});

router.get("/sortDescending", (req, res) => {
  if (req.query.sortBy === "none") {
    return res.json(userDAO.getAll());
  }

  const sorted = userDAO.getDescendingSorted(req.query.sortBy, req.query.users);
  return res.json(sorted);
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  const user = userDAO.getByUsername(username);

  if (!user) {
    return res.status(404).json({ error: "User not found!!!" });
  }
  return res.json(user);
});

//provera da li username vec postoji
router.get("/check/:username", (req, res) => {
  const username = req.params.username;
  const user = userDAO.getByUsername(username);

  if (user) {
    return res.status(409).json({ error: "User already exists" });
  }
  return res.status(200).json({ message: "Username is available" });
});

router.get("/:username/:factoryId", (req, res) => {
  const usersAccepted = purchaseDao.getCustomersByFactoryIdAccepted(
    req.params.factoryId
  );

  const usersProccesing = purchaseDao.getCustomersByFactoryId(
    req.params.factoryId
  );

  const user = userDAO.getByUsername(req.params.username);

  const fullName = user.name + " " + user.lastname;

  console.log(usersAccepted);
  console.log(fullName);

  const isProcessing = usersProccesing.includes(fullName);
  const isAccepted = usersAccepted.includes(fullName);

  let retMess = "";

  if (isAccepted) {
    retMess = "You can leave a comment";
  } else if (isProcessing && !isAccepted) {
    retMess = "Please wait until your purchase is processed!";
  } else {
    retMess = "You first have to buy something!";
  }

  console.log(retMess);

  return res.json({
    isTrue: isAccepted,
    message: retMess,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = userDAO.getByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  if (user.blocked === true) {
    return res.status(403).json({ error: "User is blocked!" });
  }

  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
      customerType: user.customerType,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  //res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

  res.json({
    message: "Login successful",
    token,
    role: user.role,
    customerType: user.customerType,
  });
});

//primer poziva zasticene stranice, samo ako ima token (ako je logovan) dobice uvid u stranicu
//dok se uloga proverava na frontu
router.get("/cart", authenticateToken, (req, res) => {
  const user = userDAO.getByUsername(req.user.username);
  if (user) {
    res.json(user.cart);
  } else {
    res.sendStatus(404);
  }
});

//koristi se na javnim stranicama za proveravanje logina/tokena
router.post("/verifyToken", (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({
      username: user.username, // kako ovo radi?????
      role: user.role,
      customerType: user.customerType,
      factory: userDAO.getByUsername(user.username).factory,
    });
  });
});

router.post("/", async (req, res) => {
  const {
    username,
    password,
    name,
    lastname,
    gender,
    birthDate,
    role,
    purchases,
    cart,
    factory,
    points,
    customerType,
    suspicious,
    blocked,
  } = req.body;

  const existingUser = userDAO.getByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User(
    null,
    username,
    hashedPassword,
    name,
    lastname,
    gender,
    birthDate,
    role,
    purchases,
    cart,
    factory,
    points,
    customerType,
    suspicious,
    blocked
  );

  const addedUser = userDAO.add(newUser);
  return res.json({
    message: "User registered successfully",
    user: addedUser,
  });
});

router.get("/isSuspicious/:id", (req, res) => {
  const id = Number(req.params.id);

  console.log("AAAAAAAAAAAAAAAAAAAAAA");

  userDAO.setToSuspicious(id);
  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json("User set to suspicious successfully");
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  console.log(req.body);

  const updatedData = { id, ...req.body };
  const updatedUser = userDAO.update(updatedData);

  console.log(updatedUser);

  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedUser = userDAO.delete(id);
  if (!deletedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

module.exports = router;
