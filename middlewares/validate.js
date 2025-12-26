const User = require("../models/user");
const bcrypt = require("bcryptjs");
exports.validate = async (req, res, next) => {
  try {
    console.log("Inside valiudate function with value", req.body);
    const { number, password, email } = req.body;

    const numberValidate = /^\d{10}$/.test(number);
    if (!numberValidate)
      return res.status(400).json({ error: "Number is invalid" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const exEmail = await User.findOne({ where: { email: email } });
    if (exEmail)
      return res.status(400).json({ error: "User email already exists" });

    const pass = await bcrypt.hash(password, 10);
    req.body.password = pass;
    next();
  } catch (err) {
    console.log("Error in Validation function", err);
    return res.status(500).json({ error: "Error in Validation" });
  }
};
