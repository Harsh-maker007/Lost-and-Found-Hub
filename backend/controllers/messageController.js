const Message = require('../models/Message');
const Post = require('../models/Post');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, postId, messageText } = req.body;

    if (!receiverId || !postId || !messageText?.trim()) {
      return res.status(400).json({ message: 'Receiver, post, and message are required.' });
    }

    if (req.userId === receiverId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const message = new Message({
      senderId: req.userId,
      receiverId,
      postId,
      messageText: messageText.trim(),
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('postId', 'title type category');

    res.status(201).json(populatedMessage);
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
        { receiverId: req.userId },
      ],
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }],
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('postId', 'title type category location imageUrl createdBy')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching your messages' });
  }
};
