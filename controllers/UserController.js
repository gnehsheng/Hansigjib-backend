const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { reset } = require("nodemon");


const saltRounds = 10;
router.get("/seed", async (req, res) => {
    try {
        await User.deleteMany({})
        await User.create([
          {
            username: "simon",
            password: bcrypt.hashSync("12345", saltRounds),
          },
          {
            username: "admin",
            password: bcrypt.hashSync("88888", saltRounds),
          },
        ]);
        res.send("Seed")
      } catch (error) {
          console.log(error);
      }
})

//* see login form
router.get("/form", (req, res) => {
    res.render("login.ejs");
});

router.get("/secret", (req, res) => {
  const user = req.session.user;

  if (user) {
  
    res.send(user)
  } else {
    res.send("no entry")
  }
})

//* login route
router.post("/login", async (req, res) => {
    const { username, password} = req.body;
    // const hashPassword = bcrypt.hashSync(password, saltRounds);
    const user = await User.findOne({ username });

    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user
      res.send("Ok")
    } else {
      res.send("No")
    }

});

//logout route
router.get('/logout', (req, res) =>{
  req.sessions.destroy()
  res.send('logout')
})

module.exports = router;
