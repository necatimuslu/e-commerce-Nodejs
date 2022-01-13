const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      mixlength: [2, "Too short"],
      maxlength: [32, "Too long"],
    },
  },
  { timestamps: true }
);

exports.Category = mongoose.model("category", categorySchema);
