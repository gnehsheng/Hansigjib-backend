require('dotenv').config()
const express = require('express')
const session = require('express-session')
const morgan = require("morgan");
const cors = require('cors')
const MongoDBSession = require ('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const UserController = require('./controllers/UserController')
const MenuController = require('./controllers/MenuController')
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

const store = new MongoDBSession({
    uri: MONGODB_URI,
    collection: 'mySessions',
})

//Middleware
app.use(morgan("tiny"))
app.use(
    session({
        secret: process.env.SECRET,
        resave: false, 
        saveUninitialized: false,
        store: store
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cors());
app.use(express.json());
app.use("/user", UserController );
app.use("/menu", MenuController );

app.get('/', (req, res) =>{
    
    console.log(req.session)
    console.log(req.session.id)
    res.send("HANSIGJIB")
})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})