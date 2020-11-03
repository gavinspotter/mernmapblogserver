const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  blgentry: { type: String, required: true },
  imge: { type: String, required: true },
  creator: { type: String, required: true },
});

module.exports = mongoose.model("Blog", blogSchema);
