const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();

var justifyText = "";
var tmp = 79;
var rateLimit = [];


router.post('/justify', auth, function (req, res) {
  req.token = req.token.slice(7);
  //res.send(req.token);
  jwt.verify(req.token, 'PRIVATE_KEY', (err) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    else {
      if (!checkUserRate(req)) {
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
  });


  function checkUserRate(props) {
    var nbwords = props.body.length;
    var userRateLimit = rateLimit[props.token];
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


function newSpace(string) {
  const nbChar = 80;
  var newLine = string.split(/(\n)/);
  var q = 1;
  for (var i = 0; i < newLine.length; i++) {
    var line = newLine[i].trim();
    if (line.length >= nbChar) {
      continue;
    }
    for (var j = 0; j < line.length; j++) {
      if (line[j] == " " && line.length < nbChar) {
        line = setCharAt(line, j, " ");
        j = j + q;
      }
      if (j == line.length - 1 && line.length < nbChar) {
        j = 0;
        q++;
      }
    }
    newLine[i] = line;
  }
  return newLine.join("\n");

}

function setCharAt(string, index, char) {
  if (index > string.length - 1)
    return string;
  return string.substring(0, index) + char + string.substring(index + 1);
}


module.exports = router;
