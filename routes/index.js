var express = require('express');
var router = express.Router();
const path = require('path');

module.exports = function(app) {
  /* GET home page. */
// Answers GET requests sent to /
  app.get('/', function (req, res) {
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, '../public',`/index.html`))
    } else {
      res.send('Was für GET request')
    }
  })

// Answers POST requests sent to /
  app.post('/', function (req, res) {
    res.send('Was für POST request')
  })

// Answers PUT requests sent to /
  app.put('/', function (req, res) {
    res.send('Was für PUT request')
  })

// Answers DELETE requests sent to /
  app.delete('/', function (req, res) {
    res.send('Was für DELETE request')
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