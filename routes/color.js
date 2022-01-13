const { Color } = require("../models/color");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const colorList = await Color.find({});
    if (!colorList)
      return res.status(400).json({ message: "colorList not found" });
    res.status(200).send(colorList);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    let color = new Color({
      name: req.body.name,
    });
    color = await color.save();

    if (!color) return res.status(500).json({ message: "color not create" });
    res.status(201).send(color);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", (req, res) => {
  try {
    Color.findByIdAndRemove(req.params.id)
      .then((c) => {
        if (c) return res.status(200).json({ message: "color is delete" });
        else return res.status(400).json({ message: "color not delete" });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
