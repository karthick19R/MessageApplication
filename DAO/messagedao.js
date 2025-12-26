const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

const messageDao = {
  addMessage,
  getAllMessages,
  getMessageById,
  getConversation
};

// Add a new message
async function addMessage(senderId, content, receiverId) {
  return Message.create({ senderId, content, receiverId });
}

// Get all messages for a user
async function getAllMessages(userId) {
  return Message.findAll({
    where: {
      [Op.or]: [{ senderId: userId }, { receiverId: userId }]
    },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });
}

// Get message by ID
async function getMessageById(userId, messageId) {
  return Message.findOne({
    where: {
      id: messageId,
      [Op.or]: [{ senderId: userId }, { receiverId: userId }]
    },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
    ]
  });
}

// Get conversation between two users
async function getConversation(userId, otherUserId) {
  return Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
    ],
    order: [['createdAt', 'ASC']] // oldest first
  });
}

module.exports = messageDao;
