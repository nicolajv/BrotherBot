import express = require('express');

const app = express();
const port = 4200;

app.listen(port, () => {
  console.log('Hello world');
});
