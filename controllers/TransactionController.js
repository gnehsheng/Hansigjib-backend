const express = require("express");
const router = express.Router();
const Transaction = require('../models/Transaction.js')
const SeedTransaction = require('../models/SeedTransaction')
// const TransactionCollection = require('../models/Transaction2')

//// SEED
router.get("/seed", async (req, res) => {
  try {
    await Transaction.deleteMany({})
    await Transaction.create(SeedTransaction);
    res.status(200).send("Seed")
    //res.redirect("/")
  } catch (error) {
    console.log(error);
  }
})

//// INDEX
router.get("/", (req, res) => {
  // Transaction.find()
  //   .then(SeedTransaction => {
  //   res.json(SeedTransaction)
  // })
  // .catch(err => {
  //   res.json(err)
  // })
  res.status(200).send('Success')
});


//Create
router.post("/create", async (req, res) => {
  try {

    let newTransaction = []
    req.body.items.map(async (el) => {
      const { name, price, quantity, itemTotal } = el
      newTransaction.push({ name, price, quantity, itemTotal })
    })
    
    const transaction = await Transaction.create({transactions: newTransaction})

    transaction.save()
    res.status(200).send('Success')



  } catch (error) {
    res.status(400).json({ error: error.message });
  };
})

module.exports = router;
