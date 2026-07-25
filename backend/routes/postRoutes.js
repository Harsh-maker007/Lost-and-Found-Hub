const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.get('/mine', auth, postController.getMyPosts);
router.post('/', auth, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

module.exports = router;
