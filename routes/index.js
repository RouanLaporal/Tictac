var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var justifyText = "";
var tmp = 79;


router.post('/justify', function(req, res) {
  res.type('text/plain');
  for(i=0;i<req.body.length;i++){
    justifyText += req.body[i];
    if (i == tmp){
      if(req.body[i]== ' ' || req.body[i] == ',' || req.body[i] == '.'){
        justifyText += "\r";
        tmp = i + 80;
      }
      else{
        var p=0;
        while(req.body[i]!== ' ' || req.body[i] == ',' || req.body[i] == '.'){
          i-= 1;
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
});
router.post('/token', function(req,res){
if(!req.body.email){
  return res.status(401).json({ error: 'Can\'t create session' });
}
else{
  res.status(200).json({
    email: req.body.email,
    token: jwt.sign(
      { email: req.body.email },
      'RANDOM_TOKEN_SECRET',
      {expiresIn: '24h'}
    ),
    rateLimit: {words:0, date: new Date()} 
  })
}
})


function newSpace(string){
  const nbChar = 80;
  var newLine = string.split(/(\n)/);
  var q = 1 ;
  for (var i = 0; i < newLine.length; i++){
      var line = newLine[i].trim();
      if(line.length >=  nbChar){
          continue;
      }
      for(var j = 0; j<line.length; j++){
          if(line[j] == " " && line.length < nbChar){
              line = setCharAt(line, j, " ");
              j = j + q;
          }
          if(j == line.length -1 && line.length < nbChar){
              j = 0;
              q++;
          }
      }
      newLine[i] = line;
  }
  return newLine.join("\n");

}

function setCharAt(string, index, char){
  if(index > string.length-1)
      return string;
  return string.substring(0, index) + char + string.substring(index+1);
}
module.exports = router;
