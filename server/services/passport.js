const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require("../config/keys")

const User = mongoose.model('users')

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user))
})

passport.use(new GoogleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleSecret,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshtoken, profile, done) => {
    const userExists = await User.findOne({ googleId: profile.id });
    console.log(userExists)
    if(userExists) {
        done(null, userExists);
    } else {
        const newUser = await new User({ googleId: profile.id }).save();
        done(null, newUser);
    }
}))