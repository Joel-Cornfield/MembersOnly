const pool = require('../db/pool');

// Create a new message
exports.createMessage = async (req, res) => {
    const { title, text } = req.body;
    const userId = req.user.id;

    try {
        await pool.query('INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)', [title, text, userId]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/create-message');
    }
};

// Get all messages
exports.displayMessages = async (req, res) => {
  try {
    // Join messages with users to get the author's name
    const result = await pool.query(`
      SELECT messages.id, messages.title, messages.text, messages.timestamp, 
             users.first_name, users.last_name 
      FROM messages
      LEFT JOIN users ON messages.user_id = users.id
      ORDER BY messages.timestamp DESC
    `);

    const messages = result.rows;
    res.render('index', { messages, currentUser: req.user });
  } catch (err) {
    console.error(err);
    res.render('index', { messages: [], currentUser: req.user });
  }
};


// Delete a message (only for admins) 
exports.deleteMessage = async (req, res) => {
    const messageId = req.params.id;

    try {
        // Check if the current user is an admin
        if (!req.user || !req.user.admin) {
            return res.status(403).send("You are not authorized to delete messages.");
        }

        // Delete the message from the database
        await pool.query('DELETE FROM messages WHERE id = $1', [messageId]);

        // Redirect back to the home page after deleting the message
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while trying to delete the message.");
    }
};