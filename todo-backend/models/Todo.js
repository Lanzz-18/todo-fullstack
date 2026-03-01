const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unqiue: true },
  password: { tyoe: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
