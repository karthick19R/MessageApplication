const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const data = await user.create(req.body);
    res.json({
      message: "User Created",
      user: {
        id: data.id,
        name: data.name,
        number: data.number,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exUser = await user.findOne({ where: { email } });
    if (!exUser) return res.status(400).json({ message: "NO User Found" });
    const match = await bcrypt.compare(password, exUser.password);
    if (!match) return res.status(400).json({ error: "Invalid Password" });
    const token = jwt.sign(
      { id: exUser.id, username: exUser.name },
      process.env.JWT_SECRETKEY,
      { expiresIn: "1h" }
    );
    res.json({
      token: token,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.updateuser = async (req, res) => {
  try {
    const userid = req.user.id;
    const { username } = req.body;
    if (!username || username.length < 3)
      return res.status(401).json({ message: " Invalid Name" });
    //const updatevalue = await user.update();
    const [updated] = await user.update(
      { name: username },
      { where: { id: userid } }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ error: "User not found or no changes made" });
    }

    res.json({ message: "Username updated successfully", username });
  } catch (err) {
    console.log("Error in update user function")
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userid = req.user.id;
    const deleted = await user.destroy(
      { where: { id: userid } }
    );
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "User not found or no changes made" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("Error in delete user function")
    res.status(500).json({ error: err.message });
  }
};

exports.viewalluser = async (req, res) => {
  try {
    const users = await user.findAll()
    if (users.length===0) {
      return res
        .status(404)
        .json({ error: "No user available" });
    }

    res.json({ users });
  } catch (err) {
    console.log("Error in all user function")
    res.status(500).json({ error: err.message });
  }
};