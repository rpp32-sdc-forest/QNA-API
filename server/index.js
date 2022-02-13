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
  queries.getQuestionsNAnswers(productId, (err, response) => {
    if (err) {
      res.status(400).send('get question error');
    } else {
      const result = { product_id: productId, results: response.rows };
      res.send(result);
    }
  });
});
// post question
app.post('/qa/questions/:id', async (req, res) => {
  const productId = req.body.product_id;
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  queries.postQuestion(productId, body, name, email, (err, response) => {
    if (err) {
      res.status(400).send('post question error');
    } else {
      res.status(201).send('question posted');
    }
  });
});
// post answer
app.post('/qa/answers/:id', async (req, res) => {
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