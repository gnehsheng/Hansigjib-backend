const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router, application } = require("express");
const { reset } = require("nodemon");
const { BrowserRouter } = require("react-router-dom");

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
     next();
  } else {
    res.status(200).send("Sorry you have no access.")
  }
};

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

//? secret
router.get("/account", isAuthenticated, (req, res) => {
  res.status(200).send('Success')
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
    user.save().then(() => res.status(200).send('Success'));
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
})

router.get("/login", (req, res) => {
  if(req.session.username) {
    res.status(200).send({loggedIn : true, username: req.session.username})
  } else {
    res.status(200).send({loggedIn: false})
  }
})

//* login route
router.post("/login", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ username: body.username });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      req.session.isAuthenticated = true
      res.status(200).json({ message: "Valid password" });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});


//logout route
router.post('/logout', (req, res) => {
  req.session.destroy()
  res.status(200).send('You are logged out.')
})

module.exports = router;
