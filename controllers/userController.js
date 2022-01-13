const { User } = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  try {
    const { name, picture, email } = req.user;
    const user = await User.findOneAndUpdate(
      { email },
      { name, picture },
      { new: true }
    );

    if (user) {
      res.json(user);
    } else {
      let newUser = new User({
        email,
        picture,
        name,
      });
      newUser = await newUser.save();
      if (!newUser) return res.status(500).json({ success: false });
      res.json(newUser);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
