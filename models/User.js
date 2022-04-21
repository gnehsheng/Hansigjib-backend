const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: {type: String, required: true},
  userTransaction: [{type: Schema.Types.ObjectId, ref:'Transaction' }]

});

const User = mongoose.model("User", userSchema);

module.exports = User