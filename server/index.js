const express = require ('express');
const app = express();
const cors = require('cors');
const pool = require('../database/pg.js');

const port = 3001;
app.use(cors());
app.use(express.json());


app.post('/demo', async (req, res) => {
  try {
    console.log(req.body);
  } catch {
    console.error(err.message);
  }
});








app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
})