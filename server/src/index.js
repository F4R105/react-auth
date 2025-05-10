require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const {passport, generateToken} = require('./auth');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(morgan('dev'));

// Registration Route
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Hash password before storing
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash], (err) => {
            if (err) return res.send("Email already exists");
            res.json({
                email,
                token: generateToken({ id: this.lastID, email})
            });
        });
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(401).json({ error: "User not found" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error verifying password" });
            if (!isMatch) return res.status(401).json({ error: "Incorrect email or password" });

            res.json({
                email: user.email,
                token: generateToken({ id: user.id,email: user.email})
            });
        });
    });
});

// Protected Route
app.get('/data', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: "You are authenticated!", user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running at http://localhost:3000'));
