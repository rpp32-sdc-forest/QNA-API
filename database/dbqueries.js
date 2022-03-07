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
    where product_id = $1 and questions.reported = false
    order by question_id DESC
    offset $2 rows fetch next $3 rows only;
  `,

  updateQuestionHelpful: `
    update questions
    set helpful = helpful + 1 where question_id = $1;
  `,
  updateAnswerHelpful: `
    update answers
    set helpful = helpful + 1 where answer_id = $1;
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
  postNewQuestion: `
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
  postPhotos: `
    insert into answers_photos (
        answer_id,
        photo_url
      )
      VALUES ($1, $2)
 `,
  reportQuestion: `
    update questions
    set reported = true where question_id = $1;
 `,
  reportAnswer: `
    update answers
    set reported = true where answer_id = $1;
 `
}
