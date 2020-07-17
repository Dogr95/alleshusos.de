var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const TwitchLogin = require(`../twitch/main.js`);
const cors = require('cors');
const F = require('fs');
let game_users = {};
const bcrypt = require('bcrypt');

router.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('http://alleshusos.de/');
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
    } else if ('channel_by_id'==req.params.command) {
        // Answers request with the channel object of given userid
        TwitchLogin.refresh()
        .then(TC => {
            console.log(typeof req.params.object)
            TC.kraken.channels.getChannel(req.params.object)
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
    } else if (req.params.command=='login') {
      console.log(req.params.object)
    } else {
        res.send('Invalid Input')
    }
});

router.post('/login', async function (req, res) {
  const request = req.body
  const user = getUserByName(request.name)
  if (!user) {
      res.send(response(false))
      return
  }

  if (!request.password) {
    res.send(response(false))
    return
  }

  if (!request.name) {
    res.send(response(false))
    return
  }

  try {
      if (await bcrypt.compare(request.password, user.password)) {
          res.send(response(true, user))
          return
      } else {
          res.send(response(false))
          return
      }
  } catch (e) {
    console.log(e)
      res.send(e)
      return
  }
})

function getUserByName(name) {
  game_users = load_users()
  for (user in game_users) {
    if (game_users[user].name === name) {
      return game_users[user]
    }
  }
  return false
}

function response(status, user=null) {
  if(status && user) {
    return {
      "success": true,
      "user": user
    }
  } else {
    return {
      "success": false
    }
  }
}

function load_users() {
  return JSON.parse(F.readFileSync('game_users.json', function (err) { console.log(err) }));
}

router.post('/register', async function (req, res) {
  game_users = load_users()
  const request = req.body
  const user = {
    "id": `${new Date().getTime()}`,
    "name": request.name,
    "password": request.password
  }
  if (getUserByName(user.name)) {
      res.send(response(false))
      return
  }

  try {
      user.password = await bcrypt.hash(req.body.password, 10)
      game_users.push(user)
      F.writeFileSync('game_users.json', JSON.stringify(game_users, null, 4))
      res.send(response(true, user))
  } catch (e) {
    console.log(e)
      res.send(e)
      return
  }
})

module.exports = router;
