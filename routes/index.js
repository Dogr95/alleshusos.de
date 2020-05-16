var express = require('express');
var router = express.Router();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const F = require('fs');
const users = JSON.parse(F.readFileSync('private/users.json', function (err) { console.log(err) }))

module.exports = function(app) {
  require('../pass.js')(app,
          name => users.find(user => user.name === name),
            id => users.find(user => user.id === id)
    );
    app.use(cors({
            origin: '*',
            optionsSuccessStatus: 200
        }));

  /* GET home page. */
  // Answers GET requests sent to /
  app.get('/', function (req, res) {
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, '../public',`/index.html`))
    } else {
      res.send('Was für GET request')
    }
  })
  // no-category redirection
  app.get('/no-category', function (req, res) {
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, '../public',`/no-category.html`))
    } else {
      res.send('Was für GET request')
    }
  })
  function authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/login')
  }

  function already_authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/')
    }

    next()
  }
  app.get('/coolshit', authenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../private',`/coolshit.html`))
  })
    // app.use('/private', express.static(__dirname + "/private"))
    // app.use('/private', [authenticated, express.static(__dirname + "/private" )])
    app.use('/archive', authenticated, (req, res) => {
      res.sendFile(path.join(__dirname, '../private', '/archive.html'))
    })

// Answers POST requests sent to /
  app.post('/', function (req, res) {
    res.send('Was für POST request')
  })
  app.get('/login', already_authenticated, function (req, res) {
    res.sendFile(path.join(__dirname, '../public',`/login.html`))
  })
  app.get('/login/request', already_authenticated, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/request.html'))
  })
    app.get('/register', already_authenticated, function (req, res) {
    res.sendFile(path.join(__dirname, '../public',`/register.html`))
  })

// Answers PUT requests sent to /
  app.put('/', function (req, res) {
    res.send('Was für PUT request')
  })

// Answers DELETE requests sent to /
  app.delete('/', function (req, res) {
    res.send('Was für DELETE request')
  })

  app.delete('/logout', (req, res) => {
    req.logOut()
    req.redirect('/login')
  })


// Puts all files in /public/ to / and makes them accessible
//   app.use(express.static(path.join(__dirname, 'public')))

// answers invalid requests
  app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname, '../public',`/404.html`))
  })

// answers errors
  app.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send(`Alles Husos... gab ne Fehlermeldung... <br><br>${err.stack}`)
  })

}