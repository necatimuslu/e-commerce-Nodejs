const router = require("express").Router();

const orderController = require("../controllers/orderController");
const { authCheck } = require("../middleware/auth");

router.get("/", authCheck, orderController.getOrderList);
router.post("/", authCheck, orderController.createOrder);

module.exports = router;
