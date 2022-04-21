const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction.js");
const User = require("../models/User");
const SeedTransaction = require("../models/SeedTransaction");
// const TransactionCollection = require('../models/Transaction2')

//// SEED
router.get("/seed", async (req, res) => {
  try {
    await Transaction.deleteMany({});
    //await Transaction.create(SeedTransaction);
    res.status(200).send("Seed");
    //res.redirect("/")
  } catch (error) {
    console.log(error);
  }
});

//// INDEX
router.get("/", (req, res) => {
  Transaction.find()
    .then((transaction) => {
      res.json(transaction);
    })
    .catch((err) => {
      res.json(err);
    });
  // res.status(200).send('Success')
});

//Create
router.post("/create", async (req, res) => {
  try {
    let newTransaction = [];
    req.body.items.map(async (el) => {
      const { name, price, quantity, itemTotal } = el;
      newTransaction.push({ name, price, quantity, itemTotal });
    });

    const transaction = await Transaction.create({
      transactions: newTransaction,
    });

    transaction.save();

    res
      .status(200)
      .json({ message: "Success", transaction_id: transaction._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/userTransaction", async (req, res) => {
  try {
    let userTransaction = [];

    req.body.items.map(async (el) => {
      const { name, price, quantity, itemTotal } = el;
      userTransaction.push({ name, price, quantity, itemTotal });
    });

    const itemTransaction = await Transaction.create({
      transactions: userTransaction,
    });

    const result = await User.findOneAndUpdate(
      { username: req.session.user },
      { $push: { userTransaction: itemTransaction.id } }
    );

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", (req, res) => {
  Transaction.findById(req.params.id)
    .then((transaction) => {
      res.json(transaction);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
