const router = require("express").Router();

const {
  productById,
  productList,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductByCount,
  limitList,
  bestList,
  productTotalCount,
  ratingProduct,
  releatedProduct,
  searchProduct,
} = require("../controllers/productController");

const { authCheck, adminCheck } = require("../middleware/auth");

router.get("/", productList);
router.get("/get/total", productTotalCount);
router.get("/get/:count", listProductByCount);
router.get("/get/releated/:id", releatedProduct);
router.get("/:id", productById);
router.post("/", authCheck, adminCheck, createProduct);
router.post("/limits", limitList);
router.post("/best", bestList);
router.post("/search/filters", searchProduct);
router.put("/:id", authCheck, adminCheck, updateProduct);
router.put("/star/:id", authCheck, ratingProduct);
router.delete("/:id", authCheck, adminCheck, deleteProduct);

module.exports = router;
