const express = require('express');
require('dotenv').config();
const port = parseInt(process.env.port)
const app = express();

app.get('/', function (req, res) {
    res.send('Was für GET request')
})

app.post('/', function (req, res) {
    res.send('Was für POST request')
})

app.put('/', function (req, res) {
    res.send('Was für PUT request')
})

app.delete('/', function (req, res) {
    res.send('Was für DELETE request')
})

// app.post('/twitch_module/', function (req, res) {
//     const Twitch = require('test/main');
//     console.log(Twitch)
// })

app.use(express.static('public'))

app.use(function (req, res, next) {
    res.status(404).sendFile('public/404.html', { root : __dirname })
})
app.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send(`Alles Husos... gab ne Fehlermeldung... <br><br>${err.stack}`)
})

app.listen(port, () => console.log(`vertiPanel listening at http://localhost:${port}`))