const mongoose = require("mongoose");
const { Schema } = mongoose;

const subSchema = new Schema({
        name: {type: String}  ,
        quantity: {type: Number} , 
        price: {type: Number},
        itemTotal: {type: Number},
});

// const transactionSchema = new Schema({
//     transactions: [subSchema]
// })

// const Transaction = mongoose.model("Transaction", transactionSchema);

const Transaction = mongoose.model("Transaction", subSchema);
module.exports = Transaction;