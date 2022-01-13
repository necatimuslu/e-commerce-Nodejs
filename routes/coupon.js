const router = require("express").Router();

const {
  couponList,
  createCoupon,
  removeCopun,
} = require("../controllers/couponController");

const { authCheck, adminCheck } = require("../middleware/auth");

router.get("/", couponList);
router.post("/", authCheck, adminCheck, createCoupon);
router.delete("/:id", authCheck, adminCheck, removeCopun);

module.exports = router;
