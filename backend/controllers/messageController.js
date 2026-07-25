const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, postId, messageText } = req.body;
    
    if (req.userId === receiverId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const message = new Message({
      senderId: req.userId,
      receiverId,
      postId,
      messageText
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

exports.getMessagesForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // We only want to get messages related to this post where the current user is involved
    const messages = await Message.find({
      postId,
      $or: [
        { senderId: req.userId },
        { receiverId: req.userId }
      ]
    }).populate('senderId', 'name').sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};
