const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.addmessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { content, receiverId } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    const message = await Message.create({ content, senderId, receiverId });

    res.json({
      message: "Message sent successfully",
      data: message
    });
  } catch (err) {
    console.error("Error in addMessage:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getallmessage = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (messages.length === 0) {
      return res.status(404).json({ error: "No messages found" });
    }

    res.json({ messages });
  } catch (err) {
    console.error("Error in getAllMessages:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getmessagebyid = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message });
  } catch (err) {
    console.error("Error in getMessageById:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getconversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.query.userId;

    if (!otherUserId) {
      return res.status(400).json({ error: "Other user ID is required" });
    }

    const messages = await Message.findAll({
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

    if (messages.length === 0) {
      return res.status(404).json({ error: "No conversation found" });
    }

    res.json({ conversation: messages });
  } catch (err) {
    console.error("Error in getConversation:", err.message);
    res.status(500).json({ error: err.message });
  }
};
