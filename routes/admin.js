const router = require("express").Router();

const { orders, orderStatus } = require("../controllers/admin");

const { authCheck, adminCheck } = require("../middleware/auth");

router.get("/order", authCheck, adminCheck, orders);
router.put("/order-status", authCheck, adminCheck, orderStatus);
module.exports = router;
