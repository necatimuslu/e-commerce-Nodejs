const { Brand } = require("../models/brand");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const brandList = await Brand.find({});
    if (!brandList)
      return res.status(400).json({ message: "brand list not found" });
    res.status(200).send(brandList);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    let brand = new Brand({
      name: req.body.name,
    });
    brand = await brand.save();

    if (!brand) return res.status(500).json({ message: "brand not create" });
    res.status(201).send(brand);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", (req, res) => {
  try {
    Brand.findByIdAndRemove(req.params.id)
      .then((b) => {
        if (b) return res.status(200).json({ message: "brand is delete" });
        else return res.status(400).json({ message: "brand not delete" });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
