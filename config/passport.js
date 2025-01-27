const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db/pool'); 

// Define the local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',  // Use email as username for login
    passwordField: 'password',  // Password field name in the form
  },
  async (email, password, done) => {
    try {
      // Find the user in the database by email
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      const bcrypt = require('bcryptjs');
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      // If password matches, return the user object
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize user to maintain session
passport.serializeUser((user, done) => {
  done(null, user.id);  // Store user id in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);  // Add user to request object as req.user
  } catch (err) {
    done(err);
  }
});
