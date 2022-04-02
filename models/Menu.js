const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema({
    img:
    {
        data: Buffer,
        contentType: String
    },
    name: { type: String },
    description: { type: String, },
    price: { type: Number },
    tags: [{ type: String }],
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;