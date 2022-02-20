const express = require('express');
const app = express();
const cors = require('cors');
const queries = require('../database/pg.js');

const port = 3001;
app.use(cors());
app.use(express.json());

// get all questions and answers
app.get('/qa/questions/:id', async (req, res) => {
  const productId = req.params.id;
  const page = req.query.page || 0;
  const count = req.query.count || 5;
  const offset = page * count;
  queries.getQuestionsNAnswers(productId, offset, count, (err, response) => {
    if (err) {
      res.status(400).send('get question error');
    } else if (!response.rows.length) {
      res.status(400).send('invalid productId');
    }else {
      const result = { product_id: productId, results: response.rows };
      res.status(200).send(result);
    }
  });
});
// post question
app.post('/qa/questions/', async (req, res) => {
  const productId = req.query.product_id;
  const body = req.query.body;
  const name = req.query.name;
  const email = req.query.email;
  queries.postQuestion(productId, body, name, email, (err, response) => {
    if (err) {
      res.status(400).send('post question error');
    } else {
      res.status(201).send('question posted');
    }
  });
});
// post answer
app.post('/qa/questions/:id/answers/', async (req, res) => {
  const questionId = req.query.id;
  const body = req.query.body;
  const name = req.query.name;
  const email = req.query.email;
  const photos = req.query.photos || [];
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
app.put('/qa/questions/:id/helpful', async (req, res) => {
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
app.put('/qa/answers/:id/helpful', async (req, res) => {
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
app.put('/qa/questions/:id/report', async (req, res) => {
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
app.put('/qa/answers/:id/report', async (req, res) => {
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