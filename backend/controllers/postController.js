const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { type, title, description, location, category, imageUrl } = req.body;
    
    const post = new Post({
      type,
      title,
      description,
      imageUrl,
      location,
      category,
      createdBy: req.userId
    });

    await post.save();
    res.status(201).json(post);
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
      .populate('createdBy', 'name')
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
