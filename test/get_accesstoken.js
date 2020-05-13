const dhl = require('postman-request');
const F = require('fs');
require('dotenv').config();
const CLIENT_ID = process.env.clientId;
const CLIENT_SECRET = process.env.clientSecret;
const code = process.env.code;
const REDIRECT_URI = process.env.uri;
const response = process.env.response;

dhl.post(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${response}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`).pipe(F.createWriteStream('at.json'));
//console.log(`https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=chat:read+chat:edit+analytics:read:extensions+analytics:read:games+bits:read+channel:edit:commercial+channel:read:subscriptions+clips:edit+user:edit+user:edit:broadcast+user:edit:follows+user:read:broadcast+user:read:email+channel:moderate+whispers:read+whispers:edit`)


//https://id.twitch.tv/oauth2/authorize?client_id=7pqynevdpjco3t9otgw267yntv9l67&redirect_uri=https://alleshusos.de&response_type=code&scope=chat:read+chat:edit+analytics:read:extensions+analytics:read:games+bits:read+channel:edit:commercial+channel:read:subscriptions+clips:edit+user:edit+user:edit:broadcast+user:edit:follows+user:read:broadcast+user:read:email+channel:moderate+whispers:read+whispers:edit
