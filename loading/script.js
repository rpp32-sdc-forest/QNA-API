import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '10s',
};

export default function () {
  //http://52.202.81.204:3001
  const id = Math.floor(Math.random() * 1000011);
  var payload = JSON.stringify(
    {
      "id": id
  });
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.get('http://localhost:3001/qna/getQuestionsList', payload, params);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
