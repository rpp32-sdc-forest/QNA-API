const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const queries = require('../database/pg.js');
const Redis = require('redis');
const redis = require('redis');
const client = redis.createClient('redis://127.0.0.1:6379');
const default_expiration = 1;
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false, type: 'application/x-www-form-urlencoded'}));
app.use((req,res,next)=>{
  console.log('request comes in:', req.path);
  next();
})
client.connect();
client.on("error", function(err){
  console.error("Errro encountered: ", err);
});
client.on('connect', function(err) {
  console.log('connected redis');
})
// get all questions and answers
app.get('/qna/getQuestionsList/', async (req, res) => {
  const productId = req.query.id;
  const page = req.query.page || 0;
  const count = req.query.count || 5;
  const offset = page * count;
  const cache = await client.get(`qna:${productId}`)
  if (cache) {
    console.log('cache hit:')
    res.send(JSON.parse(cache))
  } else {
    try {
      queries.getQuestionsNAnswers(productId, offset, count, async(err, response) => {
        if (err) {
          res.status(400).send('get question error');
        } else {
          const result = { product_id: productId, results: response.rows };
          await client.setEx(`qna:${productId}`,default_expiration,JSON.stringify(result));
          console.log('cache miss:');
          res.status(200).send(result);
        }
      });
    } catch(error) {
      console.error(error);
      res.send({data: error});
    }
  }
});
// post question :id/:body/:name/:email
app.post('/qna/questions/', async (req, res) => {
  const productId = req.body.body.id;
  const body = req.body.body.body;
  const name = req.body.body.name;
  const email = req.body.body.email;
  console.log('post new Q:', productId, body, name, email)
  queries.postQuestion(productId, body, name, email, (err, response) => {
    if (err) {
      res.status(400).send('post question error');
    } else {
      res.status(201).send('question posted');
    }
  });
});
// post answer
// /:body/:name/:email/:photos/
app.post('/qna/answers', async (req, res) => {
  console.log('post new answe:', req.body)
  const questionId = req.body.id;
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos || [];
  await queries.postAnswer(questionId, body, name, email, async (err, response) => {
    if (err) {
      res.status(400).send('post answer error');
    } else {
      if (photos.length) {
        for (let i = 0; i < photos.length; i++) {
          await queries.postPhotos(response.rows[0].answer_id, photos[i], (err, response) => {
            if (err) {
              res.status(400).send('post photos error');
            }
          })
        }
      }
      res.status(201).send('answer posted');
    }
  });
});
// question helpful
app.put('/qna/questions/:id/helpful', async (req, res) => {
  const questionId = req.params.id;
  queries.questionHelpful(questionId, (err, response) => {
    if (err) {
      res.status(400).send('questionHelpful error');
    } else {
      res.status(200).send('update questionHelpful');
    }
  });
});
// answer helpful
app.put('/qna/answers/:id/helpful', async (req, res) => {
  const answerId = req.params.id;
  queries.answerHelpful(answerId, (err, response) => {
    if (err) {
      res.status(400).send('answerHelpful error');
    } else {
      res.status(200).send('update answerHelpful');
    }
  });
});
// report question
app.put('/qna/questions/:id/report', async (req, res) => {
  console.log('report question:', req.params)
  const questionId = req.params.id;
  queries.reportQuestion(questionId, (err, response) => {
    if (err) {
      res.status(400).send('report question error');
    } else {
      res.status(200).send('report a question');
    }
  });
});

//report answer
app.put('/qna/answers/:id/report', async (req, res) => {
  const answerId = req.params.id;
  queries.reportAnswer(answerId, (err, response) => {
    if (err) {
      res.status(400).send('report answer error');
    } else {
      res.status(200).send('report an answer');
    }
  });
});







app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
})

module.exports = app;