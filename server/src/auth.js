const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const db = require('./db');

const secretKey = process.env.JWT_SECRET;

// Configure Passport JWT Strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    db.get("SELECT * FROM users WHERE id = ?", [jwt_payload.id], (err, user) => {
        if (err) return done(err, false);
        if (!user) return done(null, false);

        return done(null, {id: user.id, email: user.email});
    });
}));

// Function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
};

module.exports = {
    passport,
    generateToken
};
