const request = require("supertest");
const app = require ('../server/index.js');
const {pool} = require ('../database/pg.js');


beforeAll(done => {
  done()
})
afterAll(async () => {await pool.end()});

describe('get all QNA and answers test', () => {
  describe('GET /qa/questions/:id', () => {
      test ('should respond with a 200 status code',  async() => {
        const response = await request(app).get('/qa/questions/64620');
        expect(response.statusCode).toBe(200);
      })
      test ('should only get max of 5 results back by default',  async() => {
        const response = await request(app).get('/qa/questions/64620');
        expect(response.body.results.length).toBe(5);
      })
      test ('should get correct result back if user specific page and count',  async() => {
        const response = await request(app).get('/qa/questions/64620').query({page: 0, count: 10})
        expect(response.body.results.length).toBe(10);
      })
      test ('should get 400 if productId not valid',  async() => {
        const response = await request(app).get('/qa/questions/99999999');
        expect(response.statusCode).toBe(400);
      })
  })
  test ('should specify json in the content type header',  async() => {
    const response = await request(app).get('/qa/questions/64620');
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  })
});

describe('post question to DB', () => {
  describe('Post /qa/questions/:id', () => {
      test ('should respond with a 201 status code',  async() => {
        const response = await request(app).post('/qa/questions/').query({ body: 'jest testing', name: 'jest', email: 'jest@o.com', product_id: 64620 });
        expect(response.statusCode).toBe(201);
      })
  })
})

describe('post answer to DB', () => {
  describe('Post /qa/answers/:id', () => {
      test ('should respond with a 201 status code',  async() => {
        const response = await request(app).post('/qa/questions/3518982/answers/').query({ id: 3518982, body: 'hahahaha', name: 'happyjest', email: 'jest@qq.com', photos: 'https://res.cloudinary.com/dqidinkkf/image/upload/v1645243889/btniyxufi3hgju636er1.png'});
        expect(response.statusCode).toBe(201);
      })
  })
})

describe('update helpfulness', () => {
  describe('Put /qa/questions/:id/helpful', () => {
      test ('should respond with a 200 status code',  async() => {
        const response = await request(app).put('/qa/questions/3518982/helpful');
        expect(response.statusCode).toBe(200);
      })
  })
  describe('Put /qa/answers/:id/helpful', () => {
    test ('should respond with a 201 status code',  async() => {
      const response = await request(app).put('/qa/answers/6879354/helpful');
      expect(response.statusCode).toBe(200);
    })
  })
})


  describe('Put /qa/questions/:id/report', () => {
      test ('should respond with a 200 status code',  async() => {
        const response = await request(app).put('/qa/questions/3518982/report');
        expect(response.statusCode).toBe(200);
      })
  })
  describe('Put /qa/answers/:id/report', () => {
    test ('should respond with a 200 status code',  async() => {
      const response = await request(app).put('/qa/answers/6879364/report');
      expect(response.statusCode).toBe(200);
    })
})
