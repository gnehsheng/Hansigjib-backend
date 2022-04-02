const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    name: { type: String },
    quantity: {type: Number}, 
    price: { type: Number },
    tags: [{ type: String }],
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;