require('dotenv').config()
const express = require('express')
const session = require('express-session')
const morgan = require("morgan");
const cors = require('cors')
//const MongoDBSession = require ('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const UserController = require('./controllers/UserController')
const MenuController = require('./controllers/MenuController')
const TransactionController = require('./controllers/TransactionController')
const methodOverride = require("method-override");


const app = express()
const PORT = process.env.PORT ?? 2000
const MONGODB_URI = process.env.MONGODB_URI ?? 'localhost:2000'

// Error / Disconnection
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
})

mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

// const store = new MongoDBSession({
//     uri: MONGODB_URI,
//     collection: 'mySessions',
// })

//Middleware
app.set("trust proxy", 1);

app.use(morgan("tiny"))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://hansigjib-restaurant.vercel.app/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use("/user", UserController);
app.use("/menu", MenuController);
app.use("/transaction", TransactionController);


app.get('/', (req, res) => {

  // req.session.user = "session user"
  // console.log(req.session)
  // console.log(req.session.id)
  res.send("HANSIGJIB")
})

app.get("/auth", function (req, res) {

  res.cookie('token', 'someauthtoken')
  res.json({ id: 2 });
});
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`)
})