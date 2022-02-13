DROP DATABASE IF EXISTS qna;
CREATE DATABASE qna;

\c qna;

DROP table IF EXISTS questions;
CREATE TABLE questions (
  question_id SERIAL NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body TEXT NULL,
  epoch BIGINT DEFAULT NULL,
  asker_name VARCHAR(255),
  asker_email VARCHAR(255),
  reported BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0,
  question_date TIMESTAMP NULL DEFAULT NULL
);

\COPY questions (question_id, product_id, body, epoch, asker_name, asker_email, reported, helpful) FROM '/home/yanlin/hackreactor/QNA-API/csv/questions.csv' DELIMITER ',' CSV HEADER;

DROP table IF EXISTS answers;
CREATE TABLE answers (
  answer_id SERIAL NOT NULL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body TEXT NULL,
  epoch BIGINT DEFAULT NULL,
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0,
  answer_date TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_question
      FOREIGN KEY(question_id)
        REFERENCES questions(question_id)
);
\COPY answers (answer_id , question_id, body, epoch, answerer_name, answerer_email, reported, helpful) FROM '/home/yanlin/hackreactor/QNA-API/csv/answers.csv' DELIMITER ',' CSV HEADER;

DROP table IF EXISTS answers_photos;
CREATE TABLE answers_photos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  answer_id INTEGER NOT NULL,
  photo_url TEXT NULL,
   CONSTRAINT fk_answer
      FOREIGN KEY(answer_id)
        REFERENCES answers(answer_id)
);
\COPY answers_photos (photo_id , answer_id, photo_url) FROM '/home/yanlin/hackreactor/QNA-API/csv/answers_photos.csv' DELIMITER ',' CSV HEADER;


UPDATE questions SET question_date = to_timestamp(floor(epoch/1000));
UPDATE answers SET answer_date = to_timestamp(floor(epoch/1000));

ALTER TABLE questions DROP COLUMN epoch;
ALTER TABLE answers DROP COLUMN epoch;

CREATE INDEX ON questions (product_id);

CREATE INDEX ON answers (question_id);

CREATE INDEX ON answers_photos (answer_id);

SELECT setval('questions_question_id_seq', max(question_id)) from questions;

SELECT setval('answers_answer_id_seq', max(answer_id)) from answers;

SELECT setval('answers_photos_photo_id_seq', max(photo_id)) from answers_photos;
