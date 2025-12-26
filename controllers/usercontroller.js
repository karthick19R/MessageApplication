const userDao = require('../DAO/userdao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const data = await userDao.createUser(req.body);
    res.json({
      message: 'User Created',
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
    const exUser = await userDao.findByEmail(email);
    if (!exUser) return res.status(400).json({ message: 'No User Found' });

    const match = await bcrypt.compare(password, exUser.password);
    if (!match) return res.status(400).json({ error: 'Invalid Password' });

    const token = jwt.sign(
      { id: exUser.id, username: exUser.name },
      process.env.JWT_SECRETKEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userid = req.user.id;
    const { username } = req.body;
    if (!username || username.length < 3)
      return res.status(400).json({ message: 'Invalid Name' });

    const [updated] = await userDao.updateById(userid, { name: username });
    if (!updated) return res.status(404).json({ error: 'User not found or no changes made' });

    res.json({ message: 'Username updated successfully', username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userid = req.user.id;
    const deleted = await userDao.deleteById(userid);
    if (!deleted) return res.status(404).json({ error: 'User not found or no changes made' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.viewAllUsers = async (req, res) => {
  try {
    const users = await userDao.findAll();
    if (!users.length) return res.status(404).json({ error: 'No users available' });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    const id = req.user.id;

    if (!newPassword) return res.status(400).json({ error: 'Password is required' });

    const hashedPass = await bcrypt.hash(newPassword, 10);
    const [updated] = await userDao.updateById(id, { password: hashedPass });

    if (!updated) return res.status(404).json({ error: 'Error updating password' });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
