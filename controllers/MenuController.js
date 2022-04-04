const express = require("express");
const router = express.Router();
const Menu = require('../models/Menu.js')
const SeedMenu = require('../models/Seed')

//// INDEX
router.get("/", (req,res) => {
    Menu.find({}, (err, menu) => {
        console.log(menu)
        res.render("index.ejs", {menu})
    })
});

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

// //// CREATE
// router.get("/menu", (req, res) => {

//   const menu = new Menu(req.body)
//   menu.save();
//   res.send(req.body);
// })


module.exports = router;
