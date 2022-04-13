const express = require("express");
const router = express.Router();
const Menu = require('../models/Menu.js')
const SeedMenu = require('../models/SeedMenu')

// const isAuthenticated = (req, res, next) => {
//   if (req.session.username) {
//    next();
//   } else {
//     res.status(200).send("no entry")
//   }
// };

//// SEED
router.get("/seed", async (req, res) => {
    try {
        await Menu.deleteMany({})
        await Menu.create(SeedMenu);
        res.status(200).send("Menu Seeded")
        //res.redirect("/")
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


module.exports = router;
