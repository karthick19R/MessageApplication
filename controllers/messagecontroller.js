const messageDao = require('../DAO/messagedao');

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

    const message = await messageDao.addMessage(senderId, content, receiverId);
    res.json({ message: "Message sent successfully", data: message });
  } catch (err) {
    console.error("Error in addMessage:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getallmessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await messageDao.getAllMessages(userId);

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

    const message = await messageDao.getMessageById(userId, messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

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

    const conversation = await messageDao.getConversation(userId, otherUserId);
    if (conversation.length === 0) {
      return res.status(404).json({ error: "No conversation found" });
    }

    res.json({ conversation });
  } catch (err) {
    console.error("Error in getConversation:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const deleted = await messageDao.deletemessage(messageId);

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMessage:", err.message);
    res.status(500).json({ error: err.message });
  }
};