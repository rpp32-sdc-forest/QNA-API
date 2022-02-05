DROP DATABASE IF EXISTS qna;
-- DROP table IF EXISTS questions;
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

UPDATE questions SET question_date = to_timestamp(floor(epoch/1000));
ALTER TABLE questions DROP COLUMN epoch;
