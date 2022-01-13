const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      text: true,
    },
    description: {
      type: String,
      default: "",
      text: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    sub: { type: mongoose.Schema.Types.ObjectId, ref: "sub" },
    quantity: {
      type: Number,
      default: 1,
    },
    sold: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "color",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },

    ratings: [
      {
        star: Number,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      },
    ],
  },
  { timestamps: true }
);

exports.Product = mongoose.model("product", productSchema);
