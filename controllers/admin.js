const { Order } = require("../models/order");

exports.orders = async (req, res) => {
  try {
    let allOrders = await Order.find({})
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    res.json(allOrders);
  } catch (error) {
    console.log(error);
  }
};

exports.orderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    let updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};
