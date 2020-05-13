const TwitchModule = require('twitch').default;
require('dotenv').config();
const F = require('fs');
const CLIENT_ID = process.env.clientId;
const CLIENT_SECRET = process.env.clientSecret;

(async () => {
    const tokenData = JSON.parse(await F.readFileSync('./tokens.json', function(err){if (err != null){console.log(err)}}));
    const TwitchClient = TwitchModule.withCredentials(CLIENT_ID, tokenData.accessToken, undefined, {
        clientSecret: CLIENT_SECRET,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryDate: expiryDate === null ? null : expiryDate.getTime()
            };
            await F.writeFileSync('./tokens.json', JSON.stringify(newTokenData, null, 4), function(err){if (err != null){console.log(err)}});
        }
    });
})();
