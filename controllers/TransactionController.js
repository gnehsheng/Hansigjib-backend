const express = require("express");
const router = express.Router();
const Transaction = require('../models/Transaction.js')
const SeedTransaction = require('../models/SeedTransaction')

//// SEED
router.get("/seed", async (req, res) => {
    try {
        await Transaction.deleteMany({})
        await Transaction.create(SeedTransaction);
        res.send("Seed")
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
})

//// INDEX
router.get("/", (req,res) => {
    Transaction.find()
      .then(SeedTransaction => {
      res.json(SeedTransaction)
    })
    .catch(err => {
      res.json(err)
    })
});

module.exports = router;
