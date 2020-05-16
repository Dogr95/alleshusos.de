var express = require('express');
var router = express.Router();
const TwitchLogin = require(`../twitch/main.js`);
const cors = require('cors');

router.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('http://alleshusos.de:6969/');
});

// Answers requests sent to /api/
router.get('/:command&:object', function (req, res) {
    console.log(req.params)
    if('user'==req.params.command) {
        // Answers request with the user object
        TwitchLogin.refresh()
        .then(TC => TC.helix.users.getUserByName(req.params.object), error => console.log(error))
        .then(User => res.send(JSON.stringify(User, null, 4)))
    } else if ('channel'==req.params.command) {
        // Answers request with the channel object of given user
        TwitchLogin.refresh()
        .then(TC => {
            TC.helix.users.getUserByName(req.params.object)
                .then(User => TC.kraken.channels.getChannel(User.id))
                .then(Answer => res.send(JSON.stringify(Answer, null, 4)))
        }, error => console.log(error))
    } else if ('stream'==req.params.command) {
        // Answers request with the stream object of given user
        TwitchLogin.refresh()
        .then(TC => {
            TC.helix.users.getUserByName(req.params.object)
                .then(User => TC.helix.streams.getStreamByUserId(User.id))
                .then(Answer => res.send(JSON.stringify(Answer, null, 4)))
        }, error => console.log(error))
    } else if ('game'==req.params.command) {
        // Retrieves all Streams in given category
        TwitchLogin.refresh()
        .then(async TC => {
            const Streams = await TC.helix.streams.getStreamsPaginated({game: `${req.params.object}`})
                        let Answer = new Map();
                        let Number = 0;
                        for await (const Stream of Streams) {
                            Number++
                            Answer.set(Number, Stream)
                    }
            const obj = Object.fromEntries(Answer)
            res.send(JSON.stringify(obj, null, 4))
        }, error => console.log(error))
    } else if ('followers'==req.params.command) {
        // Answers request with the last 25 followers of given user
        TwitchLogin.refresh()
            .then(TC => {
                TC.helix.users.getUserByName(req.params.object)
                    .then(User => TC.kraken.channels.getChannelFollowers(User.id))
                    .then(Answer => res.send(JSON.stringify(Answer, null, 4)))
            }, error => console.log(error))
    } else {
        res.send('Invalid Input')
    }
});

module.exports = router;
