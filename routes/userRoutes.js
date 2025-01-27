const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

// Sign up route
router.get('/sign-up', (req, res) => {
  res.render('sign-up', { error: null });  // Pass null for error initially
});
router.post('/sign-up', userController.signUp);

// Login route
router.get('/login', userController.login);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid email or password' 
}));

// Join the club route (membership) 
router.get('/join-club', (req, res) => {
    res.render('join-club');
});
router.post('/join-club', userController.joinClub);

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass errors to next middleware
        }
        res.redirect('/'); // Redirect to home page after logout
    });
});

module.exports = router;