import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '5s',
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
      'accept':'application/json'
    },
    params: {id:64620}
  };
  const res = http.get('http://localhost:3001/qna/getQuestionsList',params);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
