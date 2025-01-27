const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
const pool = require('./db/pool');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
require('dotenv').config();

const app = express();

require('./config/passport');  

app.locals.pool = pool; // make the pool accessible in views

// Middlwares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.flash = req.flash();
  next();
});

// Routes
app.use(userRoutes);
app.use(messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});