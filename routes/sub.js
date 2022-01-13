const router = require("express").Router();

const subController = require("../controllers/subController");
const { adminCheck, authCheck } = require("../middleware/auth");

router.get("/", subController.subList);
router.get("/:id", subController.getSubById);
router.post("/", authCheck, adminCheck, subController.createSub);
router.put("/:id", authCheck, adminCheck, subController.updateSub);
router.delete("/:id", authCheck, adminCheck, subController.deleteSub);

module.exports = router;
