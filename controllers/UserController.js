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

//Create
router.post("/signup", async (req, res) => {
  const body = req.body

  if (!(body.username && body.password)) {
    return res.status(400).send({ error: error.message })
  }
  try {
    const user = await User.create(req.body);
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.save().then(() => res.status(200).send('Success'))
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
})

//* login route
router.post("/login", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ username: body.username });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      res.status(200).json({ message: "Valid password" });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});


//logout route
router.get('/logout', (req, res) => {
  req.sessions.destroy()
  res.send('logout')
})

module.exports = router;
