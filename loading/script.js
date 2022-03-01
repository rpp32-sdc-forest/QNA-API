import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const id = Math.floor(Math.random() * 1000011);
  const res = http.get(`http://localhost:3001/qa/questions/${id}`);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
