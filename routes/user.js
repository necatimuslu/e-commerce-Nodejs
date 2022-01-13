const router = require("express").Router();

const {
  userCart,
  getUserCart,
  emptyCart,
  userAddress,
  applyCouponToUserCart,
  whishlist,
  addToWhishlist,
  removeWhishlist,
  createCashOrder,
} = require("../controllers/user");
const { authCheck } = require("../middleware/auth");

router.get("/cart", authCheck, getUserCart);
router.post("/cart", authCheck, userCart);
router.post("/address", authCheck, userAddress);
router.post("/cart/coupon", authCheck, applyCouponToUserCart);
router.post("/cash-order", authCheck, createCashOrder);
router.delete("/cart", authCheck, emptyCart);

router.get("/whishlist", authCheck, whishlist);
router.post("/whishlist", authCheck, addToWhishlist);
router.put("/whishlist/:id", authCheck, removeWhishlist);
module.exports = router;
