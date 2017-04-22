require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');

var nlp = require('compromise');
var app = express();

const banned = ['dan', 'atau', 'serta'];

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.post('/talk', function (req, res) {
  axios.post('http://frengly.com/frengly/data/translateREST', {
	"src": "id",
	"dest": "en",
	"text": req.body.message,
	"email": process.env.FRENGLY_EMAIL,
	"password": process.env.FRENGLY_PASS
})
  .then(function (response) {
    const nouns = nlp(response.data.translation)
                    .nouns()
                    .data()
                    .map(noun => noun.singular)
                    .filter(noun => !banned.includes(noun))
    res.send(nouns);
  })
  .catch(function (error) {
    console.log(error);
  });
});

console.log(process.env.FRENGLY_EMAIL);
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
