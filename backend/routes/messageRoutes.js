const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/', auth, messageController.getMyMessages);
router.post('/', auth, messageController.sendMessage);
router.get('/post/:postId', auth, messageController.getMessagesForPost);

module.exports = router;
