const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

exports.Brand = mongoose.model("brand", brandSchema);
