const { Cart } = require("../models/cart");
const { Order } = require("../models/order");
const { Product } = require("../models/product");
const { User } = require("../models/user");

exports.getOrderList = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });
    const getOrderList = await Order.find({ orderBy: user._id })
      .populate({
        path: "products.product",
        populate: { path: "brand" },
      })
      .populate({
        path: "products.product",
        populate: { path: "color" },
      });

    if (!getOrderList)
      return res
        .status(400)
        .json({ success: false, message: "order list not found" });
    res.status(200).send(getOrderList);
  } catch (error) {
    console.log(error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body;
    const user = await User.findOne({ email: req.user.email });
    let { products } = await Cart.findOne({ orderBy: user._id });
    let order = new Order({
      products: products,
      paymentIntent: paymentIntent,
      orderStatus: req.body.orderStatus,
      orderBy: user._id,
    });

    order = await order.save();

    let bulkOption = products.map((p) => {
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
