const { Pool, Client } = require('pg');
const query = require('./dbqueries.js');

const pool = new Pool({
  user: 'postgres',
  password: 'alan',
  database: 'qna',
  host: 'localhost',
  port: 5432
});

const getQuestionsNAnswers = (productId, callback) => {
  (async() => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.getQuestions, [productId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};



const postQuestion = (productId, body, name, email, callback) => {
  (async() => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.postNewQuestion, [productId, body, name, email]);
      callback(null, 'Question Posted');
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const postAnswer = (questionId, body, name, email, callback) => {
  (async() => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.postNewAnswer, [questionId, body, name, email]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const postPhotos = (answerId, photos, callback) => {
  (async() => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.postPhotos, [answerId, photos]);
      callback(null, 'Photo Posted');
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const reportAnswer = (answerId, callback) => {

};

const reportQuestion = (questionId, callback) => {

};

const questionHelpful = (questionId, callback) => {

};

const answerHelpful = (answerId, callback) => {

};





pool.on('error', (err, client) => {
  console.error("pool error", err);
  process.exit(-1);
});

module.exports = {
  getQuestionsNAnswers,
  postQuestion,
  postAnswer,
  reportQuestion,
  reportAnswer,
  questionHelpful,
  answerHelpful,
  postPhotos
}
