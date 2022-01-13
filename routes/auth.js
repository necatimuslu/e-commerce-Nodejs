const router = require("express").Router();

const { authCheck, adminCheck } = require("../middleware/auth");

const userController = require("../controllers/userController");

router.post("/create-update", authCheck, userController.createOrUpdateUser);
router.post("/current-user", authCheck, userController.currentUser);
router.post(
  "/current-admin",
  authCheck,
  adminCheck,
  userController.currentUser
);
module.exports = router;
