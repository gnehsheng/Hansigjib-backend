const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router, application } = require("express");
const { reset } = require("nodemon");


const saltRounds = 10;

//* see login form
router.get("/", (req, res) => {
     User.find()
      .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.json(err)
    })
});

router.get("/seed", async (req, res) => {
    try {
        await User.deleteMany({})
        await User.create([
          {
            username: "admin@hansigjib.com",
            password: bcrypt.hashSync("12345", saltRounds),
            name: "admin"
          },
          {
            username: "kitchen@hansigjib.com",
            password: bcrypt.hashSync("12345", saltRounds),
            name: "kitchen"
          },
           {
            username: "server@hansigjib.com",
            password: bcrypt.hashSync("12345", saltRounds),
            name: "server"
          },
        ]);
        res.send("Admin user seeded")
      } catch (error) {
          console.log(error);
      }
})

//? secret
router.get("/account", (req, res) => {
  const user = req.session.user;

  if (user) {
  
    res.send(user)
  } else {
    res.send("Sorry you have no access.")
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

router.post("/signup", async (req, res) => {
    if (req.body.username && req.body.password) {
      let newUser = {
        username: req.body.username,
        password: req.body.password
      }
      const user = await User.findOne ({username: req.body.username})
      
      if(user) {
        return res.sendStatus(400).json({"message":"Username taken"})
        
      }
      res.send({newUser})
    }
     
})

//logout route
router.get('/logout', (req, res) =>{
  req.sessions.destroy()
  res.send('logout')
})

module.exports = router;
