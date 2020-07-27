const express = require('express');
const subdomain = require('express-subdomain');
const http = require('http');
const https = require('https');
require('dotenv').config();
const api = require(`${__dirname}/routes/api.js`);
const httpApp = express();
const app = express();
const path = require('path');
const F = require('fs');

// Certificate
const privateKey = F.readFileSync('/etc/letsencrypt/live/alleshusos.de/privkey.pem', 'utf8');
const certificate = F.readFileSync('/etc/letsencrypt/live/alleshusos.de/cert.pem', 'utf8');
const ca = F.readFileSync('/etc/letsencrypt/live/alleshusos.de/chain.pem')

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
}

app.use(subdomain('api', api));

// Puts all files in /public/ to / and makes them accessible
app.use(express.static(path.join(__dirname, 'public')))

// loads main routing
require(`${__dirname}/routes/index.js`)(app);

// https redirect setup
httpApp.get('*', function(req, res, next) {
    res.redirect('https://' + req.headers.host + req.url)
})

// create servers
let httpServer = http.createServer(httpApp)
let httpsServer = https.createServer({
    key: privateKey,
    cert: certificate,
    ca: ca
}, app)
const simulation = require('../RenderTesting/Classes/alleshusos.js')(httpsServer)

// starts server
httpServer.listen(80, () => {
    console.log(`http server running on http://localhost:80`)
})

httpsServer.listen(443, () => {
    console.log('https server running on http://localhost:443')
})
