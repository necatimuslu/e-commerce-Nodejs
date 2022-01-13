const { Coupon } = require("../models/coupon");

exports.couponList = async (req, res) => {
  try {
    const couponList = await Coupon.find({});
    if (!couponList)
      return res
        .status(400)
        .json({ success: false, message: "Coupon list not found" });
    res.status(200).send(couponList);
  } catch (error) {
    console.log(error);
  }
};

exports.createCoupon = async (req, res) => {
  try {
    let coupon = new Coupon({
      name: req.body.name,
      expiry: req.body.expiry,
      discount: req.body.discount,
    });

    coupon = await coupon.save();

    if (!coupon)
      return res
        .status(500)
        .json({ success: false, message: "coupon not create" });
    res.status(201).send(coupon);
  } catch (error) {
    console.log(error);
  }
};
exports.removeCopun = (req, res) => {
  try {
    Coupon.findByIdAndRemove(req.params.id)
      .then((c) => {
        if (c)
          return res
            .status(200)
            .json({ success: true, message: "coupon delete" });
        else
          return res
            .status(400)
            .json({ success: false, message: "coupon not delete" });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  } catch (error) {
    console.log(error);
  }
};
