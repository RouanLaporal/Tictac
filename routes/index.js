const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();
const {newSpace} = require('../function/function');

var justifyText = "";
var tmp = 79;
var rateLimit = [];

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/justify', auth, function (req, res) {
  req.token = req.token.slice(7);
  jwt.verify(req.token, 'PRIVATE_KEY', (err) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    else {
      justify(req.body,req.token)
    }
  });


  /**
   * this function take the request body text and return the same text but justified
   * @return [string]
   */
  function justify() {
    if (!checkUserRate()) {
      return;
    }
    res.type('text/plain');
    for (i = 0; i < req.body.length; i++) {
      justifyText += req.body[i];
      if (i == tmp) {
        if (req.body[i] == ' ' || req.body[i] == ',' || req.body[i] == '.') {
          justifyText += "\r";
          tmp = i + 80;
        }
        else {
          var p = 0;
          while (req.body[i] !== ' ' || req.body[i] == ',' || req.body[i] == '.') {
            i -= 1;
            p++;
          }
          justifyText = justifyText.substring(0, justifyText.length - p);
          justifyText += "\r";
          tmp = i + p + 80;
        }
      }
    }
    res.send(newSpace(justifyText));
    res.status(200);
  }
  /**
   * this function check if the user rate doesn't exceed 80000 words and return True  if not and false otherwise
   * @return [boolean]
   */
  function checkUserRate() {
    var nbwords = req.body.length;
    var userRateLimit = rateLimit[req.token];
    console.log(userRateLimit);
    let userDay = userRateLimit.date.getDate();
    let currentDay = new Date().getDate();

    if (!userRateLimit || !userRateLimit.date) {
      res.status(403);
      return false;
    }
    if (currentDay !== userDay) {
      userRateLimit.date = new Date();
      userRateLimit.words = 0;
    }
    if (userRateLimit.words + nbwords > 80000) {
      res.status(402).json({ message: '402 Payment Required' });
      return false;
    }
    userRateLimit.words = userRateLimit.words + nbwords;
    rateLimit[req.token] = userRateLimit;
    return true;
  }


});
router.post('/token', function (req, res) {
  if (!req.body.email) {
    return res.status(401).json({ error: 'Can\'t create session' });
  }
  else {
    jwt.sign({ email: req.body.email }, 'PRIVATE_KEY', { expiresIn: '24h' }, function (err, token) {
      rateLimit[token] = { words: 0, date: new Date() };
      console.log(rateLimit[token]);
      res.json({ token });
    });
  }
})

module.exports = router;
