const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {type: String}  ,
    quantity: {type: Number} , 
    price: {type: Number},
    itemTotal: {type: Number},
});

const transactionSchema = new Schema({
    transactions: [itemSchema]
})

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;