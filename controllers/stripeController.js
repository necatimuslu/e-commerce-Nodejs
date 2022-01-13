const { User } = require("../models/user");
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");
const { Coupon } = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.createPaymentIntent = async (req, res) => {
  const { couponApplied } = req.body;
  const user = await User.findOne({ email: req.user.email });

  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderBy: user._id,
  });

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd",
  });
  console.log("total", totalAfterDiscount);
  console.log("son tutar", finalAmount);
  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
