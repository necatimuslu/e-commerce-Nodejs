const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: true,
      minlength: [4, "Too short"],
      maxlength: [12, "Too long"],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

exports.Coupon = mongoose.model("coupon", couponSchema);
