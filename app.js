const express = require('express');
const subdomain = require('express-subdomain');
require('dotenv').config();
const api = require(`${__dirname}/routes/api.js`);
const port = parseInt(process.env.port)
const app = express();
const path = require('path');

app.use(subdomain('api', api));

// Puts all files in /public/ to / and makes them accessible
app.use(express.static(path.join(__dirname, 'public')))

// loads main routing
require(`${__dirname}/routes/index.js`)(app);

// starts server
app.listen(port, () => console.log(`vertiPanel listening at http://localhost:${port}`));