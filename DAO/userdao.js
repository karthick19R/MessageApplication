const User = require('../models/user');
const bcrypt = require('bcryptjs');

const userDao = {
  createUser: async (data) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return User.create(data);
  },

  findByEmail: (email) => User.findOne({ where: { email } }),

  findById: (id) => User.findByPk(id),

  updateById: (id, updateData) => User.update(updateData, { where: { id } }),

  deleteById: (id) => User.destroy({ where: { id } }),

  findAll: () => User.findAll(),
};

module.exports = userDao;
