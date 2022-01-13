const { Category } = require("../models/category");
const { Product } = require("../models/product");

exports.categoryList = async (req, res) => {
  try {
    const categoryList = await Category.find({});
    if (!categoryList)
      return res
        .status(400)
        .json({ success: false, message: "category list not found" });
    res.status(200).send(categoryList);
  } catch (error) {
    console.log(error);
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    const products = await Product.find({ category })
      .populate("category")
      .populate("postedBy", "_id,name");

    res.status(200).json({
      category,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.createCategory = async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
    });
    category = await category.save();
    if (!category)
      return res
        .status(500)
        .json({ success: false, message: "category  not create" });
    res.status(201).send(category);
  } catch (error) {
    console.log(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updateCategory)
      return res
        .status(500)
        .json({ success: false, message: "category  not update" });
    res.status(201).send(updateCategory);
  } catch (error) {
    console.log(error);
  }
};
exports.deleteCategory = (req, res) => {
  try {
    Category.findByIdAndRemove(req.params.id)
      .then((category) => {
        if (category)
          return res
            .status(200)
            .json({ success: true, message: "category delete" });
        else
          return res
            .status(400)
            .json({ success: false, message: "category not delete" });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  } catch (error) {
    console.log(error);
  }
};
