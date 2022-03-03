const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const queries = require('../database/pg.js');

const port = 3001;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false, type: 'application/x-www-form-urlencoded'}));
// app.use((req,res,next)=>{
//   console.log('request comes in:', req.path);
//   next();
// })
// get all questions and answers
app.get('/qna/getQuestionsList/', async (req, res) => {
  const productId = req.query.id;
  const page = req.query.page || 0;
  const count = req.query.count || 5;
  const offset = page * count;
  queries.getQuestionsNAnswers(productId, offset, count, (err, response) => {
    if (err) {
      res.status(400).send('get question error');
    } else {
      const result = { product_id: productId, results: response.rows };
      res.status(200).send(result);
    }
  });
});
// post question
app.post('/qna/questions/:id/:body/:name/:email', async (req, res) => {
  const productId = req.params.id;
  const body = req.params.body;
  const name = req.params.name;
  const email = req.params.email;
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
  const questionId = req.body.params.id;
  const body = req.body.params.body;
  const name = req.body.params.name;
  const email = req.body.params.email;
  const photos = req.body.params.photos || [];
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