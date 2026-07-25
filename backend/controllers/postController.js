const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { type, title, description, location, category, imageUrl } = req.body;

    if (!type || !title || !description || !location || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const post = new Post({
      type,
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      location: location.trim(),
      category: category.trim(),
      createdBy: req.userId,
    });

    await post.save();
    const populatedPost = await Post.findById(post._id).populate('createdBy', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.userId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};
