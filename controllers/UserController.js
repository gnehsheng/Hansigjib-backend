const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router, application } = require("express");
const { reset } = require("nodemon");

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
router.get("/account", isAuthenticated, async (req, res) => {
  const currentUser = req.session.username;
  try {
    const userData = await User.findOne({ username: currentUser }).populate('userTransaction')
    res.status(200).send(userData)
  } catch (error) {
    res.status(400).send({ error: error.message });

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
    user.save().then(() => res.status(200).send('Success'));
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
})

//* login routes
router.post("/login", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      req.session.isAuthenticated = true
      req.session.username = user.username

      //res.cookie('name', user.username, {httpOnly: false})
      res.status(200).json(user);
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

router.delete("/delete", async (req, res) => {
  try {
    await User.findOneAndDelete({ username: req.session.username })
    //res.redirect("/signup")
    req.session.destroy()
    res.status(200).clearCookie("notcookie").send('Deleted User')
  }
  catch (error) {
    res.send(501)
  }
})

router.put("/update", async (req, res) => {
  try {
    
    const update = {
      name: req.body.name,
      password: await bcrypt.hash(req.body.password,10)
    }
    
    // console.log('looking for session', req.session)
    const filter = { username: req.session.username }
    console.log('filter', filter)
    // console.log(filter)
    const updatedUser = await User.findOneAndUpdate(filter, update, {new: true})
    console.log('updateduser', updatedUser)
      // .then((res) => {
      //   if (req.session.username) {
      //     return res.status(400).send({ error: error.message })
      //   }
      //   res.status(200).json(updatedUser);
      // }
      res.status(200).json(updatedUser)
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router;