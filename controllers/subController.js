const { Product } = require("../models/product");
const { Sub } = require("../models/sub");

exports.subList = async (req, res) => {
  try {
    const subList = await Sub.find({}).populate("parent");
    if (!subList)
      return res
        .status(400)
        .json({ success: false, message: "subList not found" });
    res.status(200).send(subList);
  } catch (error) {
    console.log(error);
  }
};
exports.getSubById = async (req, res) => {
  try {
    const sub = await Sub.findById(req.params.id).populate("parent");
    const products = await Product.find({ sub })
      .populate("sub")
      .populate("postedBy", "_id name");
    res.status(200).json({
      sub,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.createSub = async (req, res) => {
  try {
    let sub = new Sub({
      name: req.body.name,
      parent: req.body.parent,
    });
    sub = await sub.save();
    if (!sub)
      return res
        .status(500)
        .json({ success: false, message: "sub  not create" });
    res.status(201).send(sub);
  } catch (error) {
    console.log(error);
  }
};

exports.updateSub = async (req, res) => {
  try {
    const updateSub = await Sub.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, parent: req.body.parent },
      { new: true }
    );
    if (!updateSub)
      return res
        .status(500)
        .json({ success: false, message: "sub  not update" });
    res.status(201).send(updateSub);
  } catch (error) {
    console.log(error);
  }
};
exports.deleteSub = (req, res) => {
  try {
    Sub.findByIdAndRemove(req.params.id)
      .then((sub) => {
        if (sub)
          return res.status(200).json({ success: true, message: "sub delete" });
        else
          return res
            .status(400)
            .json({ success: false, message: "sub not delete" });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  } catch (error) {
    console.log(error);
  }
};
