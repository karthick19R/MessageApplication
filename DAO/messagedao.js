const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

const messageDao = {
  addMessage,
  getAllMessages,
  getMessageById,
  getConversation,
  deletemessage
};

async function addMessage(senderId, content, receiverId) {
  return Message.create({ senderId, content, receiverId });
}

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
    order: [['createdAt', 'ASC']] 
  });
}
async function deletemessage(id) {
  return Message.destroy({where :{id}});
}

module.exports = messageDao;
