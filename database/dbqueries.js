module.exports = {
  getQuestions: `
    select question_id,
    body as question_body,
    question_date as question_date,
    asker_name,
    helpful as question_helpfulness,
    reported,
      (
        select array_to_json(array_agg(x))
        from (
          select
          answers.question_id,
          answers.answer_id as id, body,
          answers.answer_date as date,
          answers.answerer_name,
          answers.helpful as helpfulness,
          array_agg(answers_photos.photo_url) photos
          from answers
          LEFT OUTER JOIN answers_photos
          ON answers.answer_id=answers_photos.answer_id
          where answers.question_id = questions.question_id and answers.reported=false
          GROUP BY answers.answer_id
        ) x
      ) as answers
    from questions
    where product_id = $1;
  `,

  updateQuestionHelpful: `

  `,
  updateAnswerHelpful: `

  `,
  postNewAnswer: `
    insert into answers (
      question_id,
      body,
      answerer_name,
      answerer_email,
      reported,
      helpful,
      answer_date
    )
    VALUES ($1, $2, $3, $4, false, 0, CURRENT_TIMESTAMP)
    returning *;
  `,
  postNewQuestion:`
  insert into questions (
    product_id,
    body,
    asker_name,
    asker_email,
    reported,
    helpful,
    question_date
  )
  VALUES ($1, $2, $3, $4, false, 0, CURRENT_TIMESTAMP);
`,
 postPhotos:`
 insert into answers_photos (
    answer_id,
    photo_url
  )
  VALUES ($1, $2)
 `
}

//    WHERE product_id=$1 AND reported=false;
// SELECT
//       *
//     FROM answers
//     WHERE answer_id=(SELECT max(answer_id) FROM answers) ;

// SELECT
// *
// FROM questions
// WHERE question_id=(SELECT min(question_id) FROM questions) ;
// `,

// SELECT
//       *
//     FROM answers_photos
//     WHERE photo_id=(SELECT max(photo_id) FROM answers_photos) ;
//     `,