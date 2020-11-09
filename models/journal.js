const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const journalSchema = new Schema({
  entry: { type: String, required: true },
  date: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Journal", journalSchema);
