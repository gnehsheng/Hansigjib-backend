require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const UserController = require('./controllers/UserController')
const MenuController = require('./controllers/MenuController')
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require('express-session')

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
});
mongoose.connection.once("open", () => {
    console.log("connected to mongoose...");
});


//Middleware
app.use(morgan("tiny"))
app.use(
    session({
        secret: "iamsimon", //a random string do not copy this value or your stuff will get hacked
        resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
        saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cors());
app.use(express.json());
app.use("/user", UserController );
app.use("/menu", MenuController );

app.get('/', (req, res) =>{
    res.send("HANSIGJIB")
})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})