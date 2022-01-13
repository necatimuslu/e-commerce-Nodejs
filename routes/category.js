const router = require("express").Router();

const categoryController = require("../controllers/categoryContoller");
const { authCheck, adminCheck } = require("../middleware/auth");
router.get("/", categoryController.categoryList);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authCheck, adminCheck, categoryController.createCategory);
router.put("/:id", authCheck, adminCheck, categoryController.updateCategory);
router.delete("/:id", authCheck, adminCheck, categoryController.deleteCategory);

module.exports = router;
