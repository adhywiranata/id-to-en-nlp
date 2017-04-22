require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');
const nlp = require('compromise');

const banned = ['dan', 'atau', 'serta'];
const { FRENGLY_EMAIL, FRENGLY_PASS } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
  <div style="
    font-family: Arial;
    display: flex;
    flex: 1;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center"
  >
    <h1 style="font-size: 3em">
      ID to EN NLP
    </h1>
    <h3>
      sentence to nouns
    </h3>
    <span>
      Please find the docs here:
      <a href="https://github.com/adhywiranata/id-to-en-nlp">id to en npl</a>
    </span>
  </div>
  `);
});

app.post('/talk', ({ body }, res) => {
  axios.post('http://frengly.com/frengly/data/translateREST', {
    src: 'id',
    dest: 'en',
    text: body.message,
    email: FRENGLY_EMAIL,
    password: FRENGLY_PASS,
  })
  .then(({ data }) => {
    const nouns = nlp(data.translation)
                    .nouns()
                    .data()
                    .map(noun => noun.singular)
                    .filter(noun => !banned.includes(noun));
    res.send(nouns);
  })
  .catch((error) => {
    res.send({ error });
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
