const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

// Sign up logic
exports.signUp = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  // Check if passwords match
  if (password !== confirm_password) {
    return res.render('sign-up', { error: 'Passwords do not match' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in the database
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, email, hashedPassword]
    );

    // Redirect to login page after successful signup
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('sign-up', { error: 'An error occurred during sign-up. Please try again.' });
  }
};

// Login logic
exports.login = (req, res) => {
    res.render('login');
}

// Membership logic
exports.joinClub = async (req, res) => {
  // Check if user is logged in (authenticated)
  if (!req.isAuthenticated()) {
      return res.redirect('/login');  // Redirect to login if not authenticated
  }

  const passcode = req.body.passcode;
  const correctPasscode = process.env.PASSCODE;

  if (passcode === correctPasscode) {
      // Ensure req.user exists before trying to access req.user.id
      if (req.user && req.user.id) {
          await pool.query('UPDATE users SET membership_status = TRUE WHERE id = $1', [req.user.id]);
          res.redirect('/');  // Redirect to the home page after joining the club
      } else {
          res.redirect('/login');  // Redirect if user ID is not available (shouldn't happen if authenticated)
      }
  } else {
      // Render with an error message
      res.render('join-club', { messages: { error: 'Incorrect passcode! Please try again.' } });
  }
};
