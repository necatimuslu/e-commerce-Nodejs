const mongoose = require("mongoose");

const subSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Too short"],
    maxlength: [32, "Too long"],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
});

exports.Sub = mongoose.model("sub", subSchema);
