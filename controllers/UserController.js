const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router, application } = require("express");
const { reset } = require("nodemon");



const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.send("Sorry you have no access.")
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
  // const {body} = req.body

  // if (!(body.username && body.password && body.email)) {
  //   return res.status(400).send({ error: error.message })
  // }
  // try {
  //   const user = await User.create(req.body);
  //   const salt = await bcrypt.genSalt(10)
  //   user.password = await bcrypt.hash(user.password, salt)
  //   user.save().then(() => res.status(200).send('Success'))
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // };

  const { username, email, password } = req.body

  const user = await User.findOne({ email })
  const hashedPw = await bcrypt.hash(password, 12)

  if (user) {
    return res.send('user exists, please try again')
  }

  try {
    user = new User({
      username,
      email,
      password: hashedPw
    })

    await user.save(() => res.status(200).send('Success'))
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
      req.session.currentUser = user
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
