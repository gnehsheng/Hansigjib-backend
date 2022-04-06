const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema({
    img: { type: String },
    name: { type: String },
    description: { type: String, },
    price: { type: Number },
    foodtype: { type: String },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;