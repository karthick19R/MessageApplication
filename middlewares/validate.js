const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const user = require("../models/user");

exports.validate = [
  body("number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Number must be 10 digits")
    .isNumeric()
    .withMessage("Number must contain only digits").
    custom(async (number)=>{
      const existingnumber = await User.findOne({where :{number}});
      if (existingnumber) {
        throw new Error("Number already exists");
      }
      return true;
    }),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      next();
    } catch (err) {
      console.error("Error in validation middleware", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
