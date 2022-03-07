const { Pool, Client } = require('pg');
const query = require('./dbqueries.js');
require('dotenv').config();


//const client = new Client({
  //   user: process.env.pgUser,
  //   password: process.env.pgPassword,
  //   database: process.env.pgDB,
  //   host: process.env.pgHost,
  //   port: process.env.pgPort,
  // });
  // client.connect();
  // const getQuestionsNAnswers = async (productId, page, count, callback) => {
  //     console.log('connect2')
  //     // const client = await client.connect()
  //     try {
  //       const result = await client.query(query.getQuestions, [productId, page, count]);
  //       callback(null, result);
  //     } catch(err) {
  //         console.log(err.stack)
  //     }
  // };

const pool = new Pool({
  user: process.env.pgUser,
  password: process.env.pgPassword,
  database: process.env.pgDB,
  host: process.env.pgHost,
  port: 5432,
});

const getQuestionsNAnswers = async (productId, page, count, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.getQuestions, [productId, page, count]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const postQuestion = (productId, body, name, email, callback) => {
  (async () => {
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
  (async () => {
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
  (async () => {
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
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.reportAnswer, [answerId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const reportQuestion = (questionId, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.reportQuestion, [questionId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const questionHelpful = (questionId, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.updateQuestionHelpful, [questionId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const answerHelpful = (answerId, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.updateAnswerHelpful, [answerId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
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
