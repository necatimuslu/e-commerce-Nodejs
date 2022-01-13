const { Product } = require("../models/product");
const { User } = require("../models/user");

exports.productList = async (req, res) => {
  try {
    const productList = await Product.find({})
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");
    if (!productList)
      return res
        .status(400)
        .json({ success: false, message: "productList not found" });
    res.status(200).send(productList);
  } catch (error) {
    console.log(error);
  }
};
exports.listProductByCount = async (req, res) => {
  try {
    const listProductByCount = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");
    if (!listProductByCount)
      return res
        .status(400)
        .json({ success: false, message: "listProductByCount not found" });
    res.status(200).send(listProductByCount);
  } catch (error) {
    console.log(error);
  }
};
exports.productById = async (req, res) => {
  try {
    const productById = await Product.findById(req.params.id)
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");
    if (!productById)
      return res
        .status(400)
        .json({ success: false, message: "product  not found" });
    res.status(200).send(productById);
  } catch (error) {
    console.log(error);
  }
};
exports.createProduct = async (req, res) => {
  try {
    let product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      sub: req.body.sub,
      quantity: req.body.quantity,
      sold: req.body.sold,
      image: req.body.image,
      shipping: req.body.shipping,
      color: req.body.color,
      brand: req.body.brand,
    });
    product = await product.save();
    if (!product)
      return res
        .status(500)
        .json({ success: false, message: "product  not create" });
    res.status(201).send(product);
  } catch (error) {
    console.log(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        sub: req.body.sub,
        quantity: req.body.quantity,
        sold: req.body.sold,
        image: req.body.image,
        shipping: req.body.shipping,
        color: req.body.color,
        brand: req.body.brand,
      },
      { new: true }
    );
    if (!updateProduct)
      return res
        .status(500)
        .json({ success: false, message: "product  not update" });
    res.status(201).send(updateProduct);
  } catch (error) {
    console.log(error);
  }
};
exports.deleteProduct = (req, res) => {
  try {
    Product.findByIdAndRemove(req.params.id)
      .then((product) => {
        if (product)
          return res
            .status(200)
            .json({ success: true, message: "product delete" });
        else
          return res
            .status(400)
            .json({ success: false, message: "product not delete" });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  } catch (error) {
    console.log(error);
  }
};

/*

exports.limitList = async (req, res) => {
  try {
    // sort = createdAt and updatedAnd , order = 'desc','asc'
    const { sort, order, limit } = req.body;
    const products = await Product.find({})
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand")
      .sort([[sort, order]])
      .limit(limit);

    if (!products)
      return res.status(400).json({ message: "Limit List not found" });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

*/

exports.limitList = async (req, res) => {
  try {
    // sort = createdAt and updatedAnd , order = 'desc','asc'
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand")
      .sort([[sort, order]])
      .limit(perPage);

    if (!products)
      return res.status(400).json({ message: "Limit List not found" });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

exports.bestList = async (req, res) => {
  try {
    // sort = createdAt and updatedAnd , order = 'desc','asc'
    const { sold, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand")
      .sort([[sold, order]])
      .limit(perPage);

    if (!products)
      return res.status(400).json({ message: "Best List not found" });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

exports.productTotalCount = async (req, res) => {
  try {
    let total = await Product.find({}).estimatedDocumentCount().exec();

    res.json(total);
  } catch (error) {
    console.log(error);
  }
};

exports.ratingProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    let existingRatingObject = product.ratings.find(
      (r) => r.postedBy.toString() === user._id.toString()
    );

    if (existingRatingObject === undefined) {
      let adedRating = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        {
          new: true,
        }
      ).exec();

      res.json(adedRating);
    } else {
      let ratingUpdated = await Product.updateOne(
        { ratigns: { $elemMatch: existingRatingObject } },
        { $set: { "ratings.$.star": star } },
        { new: true }
      );

      res.json(ratingUpdated);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.releatedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const releated = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");

    res.json(releated);
  } catch (error) {
    console.log(error);
  }
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category")
    .populate("sub")
    .populate("color")
    .populate("brand");

  res.status(200).json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let product = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    const product = await Product.find({ category })
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

const handleSub = async (req, res, sub) => {
  try {
    const product = await Product.find({ sub })
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};
const handleColor = async (req, res, color) => {
  try {
    const product = await Product.find({ color })
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

const handleBrand = async (req, res, brand) => {
  try {
    const product = await Product.find({ brand })
      .populate("category")
      .populate("sub")
      .populate("color")
      .populate("brand");

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

const handleStars = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT", // title:'$title'
        floorAvarege: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAvarege: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) {
        console.log(err);
      }
      Product.find({ _id: aggregates })
        .populate("category")
        .populate("sub")
        .populate("color")
        .populate("brand")
        .exec((err, products) => {
          if (err) console.log(err);

          res.status(200).json(products);
        });
    });
};
exports.searchProduct = async (req, res) => {
  const { query, price, category, sub, stars, color, brand } = req.body;

  if (query) {
    console.log("query ---->", query);
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    console.log("price ---->", price);
    await handlePrice(req, res, price);
  }
  if (category) {
    console.log("category ---->", category);
    await handleCategory(req, res, category);
  }
  if (sub) {
    console.log("sub --->", sub);
    await handleSub(req, res, sub);
  }
  if (stars) {
    console.log("stars --->", stars);
    await handleStars(req, res, stars);
  }
  if (color) {
    console.log("color --->", color);
    await handleColor(req, res, color);
  }
  if (brand) {
    console.log("brand --->", brand);
    await handleBrand(req, res, brand);
  }
};
