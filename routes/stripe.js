const router = require("express").Router();

const { createPaymentIntent } = require("../controllers/stripeController");
const { authCheck } = require("../middleware/auth");

router.post("/create-payment", authCheck, createPaymentIntent);

module.exports = router;
