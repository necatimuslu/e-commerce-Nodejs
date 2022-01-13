const mongoose = require("mongoose");

const colorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

exports.Color = mongoose.model("color", colorSchema);
