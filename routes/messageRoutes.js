const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Create a new message
router.get('/create-message', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('create-message');
    } else {
        res.redirect('/login');
    }
});
router.post('/create-message', messageController.createMessage);

// Display all messages (home page) 
router.get('/', messageController.displayMessages);

// Delete a message (only for admins)
router.post('/delete-message/:id', messageController.deleteMessage);

module.exports = router;
