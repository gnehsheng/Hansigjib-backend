const express = require("express");
const router = express.Router();
const Menu = require('../models/Menu.js')
const SeedMenu = require('../models/Seed')


//// SEED
router.get("/seed", async (req, res) => {
    try {
        await Menu.deleteMany({})
        await Menu.create(SeedMenu);
        res.send("Seed")
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
})

//// INDEX
router.get("/", (req,res) => {
    Menu.find()
      .then(SeedMenu => {
      res.json(SeedMenu)
    })
    .catch(err => {
      res.json(err)
    })
});
// //// CREATE
// router.get("/menu", (req, res) => {

//   const menu = new Menu(req.body)
//   menu.save();
//   res.send(req.body);
// })


module.exports = router;
