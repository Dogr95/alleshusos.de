const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
require('dotenv').config();
const F = require('fs');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

module.exports = function(app, getUserByName, getUserById) {
    const authenticateUser = async (name, password, done) => {
        const user = getUserByName(name)
        if (!user) {
            return done(null, false, { message: 'wrong credentials' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'wrong credentials' })
            }
        } catch (e) {
            return done(e)
        }
    }
    app.use(express.urlencoded({ extended: false }));
    app.use(flash())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy({ usernameField: 'name'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    })
    app.post('/register', async (req, res) => {
        try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10)
            user = {};
            user.id = Date.now().toString(),
            user.name = req.body.name,
            user.password = hashedPassword
            await F.writeFileSync('tmp', JSON.stringify(user, null, 4), function (err) {
                if (err != null) {
                    console.log(err)
                }})
            res.redirect('/login/request')
        } catch {
            res.redirect('/register')
        }
    })
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/coolshit',
            failureRedirect: '/login',
            failureFlash: true
        }))
    app.get('/logout',
        function(req, res){
            req.logout();
            res.redirect('/');
        })
    function authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/login')
  }

    app.use('/private', [authenticated, express.static(__dirname + "/private")])
}