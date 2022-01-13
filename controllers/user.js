const { User } = require("../models/user");
const { Product } = require("../models/product");
const { Cart } = require("../models/cart");
const { Coupon } = require("../models/coupon");
const { Order } = require("../models/order");
const uniqueid = require("uniqueid");
exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email });

    let cartExistByThisUser = await User.findOne({ orderBy: user._id });

    if (cartExistByThisUser) {
      cartExistByThisUser.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;

      let productFromDb = await Product.findById(cart[i]._id).select("price");
      object.price = productFromDb.price;

      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = new Cart({
      products,
      cartTotal,
      orderBy: user._id,
    });
    newCart = await newCart.save();

    console.log("new cart --->", newCart);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    let cart = await Cart.findOne({ orderBy: user._id }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
  } catch (error) {
    console.log(error);
  }
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const cart = await Cart.findOneAndRemove({ orderBy: user._id });
  res.json(cart);
};

exports.userAddress = async (req, res) => {
  const userAdress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  );

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;

  const validCoupon = await Coupon.findOne({ name: coupon });

  if (validCoupon === null) {
    res.json({
      err: "Hatalı kupon kodu",
    });
  }

  const user = await User.findOne({ email: req.user.email });

  let { products, cartTotal } = await Cart.findOne({
    orderBy: user._id,
  }).populate("products.product", "_id title price");

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  Cart.findOneAndUpdate(
    { orderBy: user._id },
    { totalAfterDiscount: totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.whishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.addToWhishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).exec();

  res.json({ ok: true });
};

exports.removeWhishlist = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: id } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  try {
    const { COD, couponApplied } = req.body;

    if (!COD) {
      return res.status(400).send("Ödeme işleminde bir hata oluştu");
    }
    const user = await User.findOne({ email: req.user.email });
    let userCart = await Cart.findOne({ orderBy: user._id }).populate(
      "products.product"
    );

    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }
    let order = new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqueid(),
        amount: finalAmount,
        status: "Kapıda ödeme",
        created: Date.now(),
        payment_method_type: ["cash"],
      },
      orderBy: user._id,
      orderStatus: "Kapıda ödeme",
    });

    order = await order.save();

    let bulkOption = userCart.products.map((p) => {
      return {
        updateOne: {
          filter: { _id: p.product._id },
          update: { $inc: { quantity: -p.count, sold: +p.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("-----> ürün güncelleme stok ve sayı güncelleme", updated);

    if (!order)
      return res
        .status(400)
        .json({ success: false, message: "order not create" });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};
