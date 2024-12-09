const User = require("../models/user");

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// Add Balance
exports.addBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero." });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.balance += amount;
    await user.save();

    res.json({ message: "Balance added successfully.", balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};
