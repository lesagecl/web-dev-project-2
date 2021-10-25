const express = require('express');

const service = express();

const array = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
  });

  // define endpoints:

service.get('/all', (request, response) => {
    response.json({
        ok: true,
        result: array,
      });
});

service.get('/one/:index', (request, response) => {
    const index = parseInt(request.params.index);
    response.json({
      ok: true,
      result: array[index],
    });
  });

  // client i think?:

  fetch('http://localhost:5000/all')
  .then(assertResponse)
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      console.log(data);
    }
  }).
  catch(error => console.error(error));
const port = 5000;
service.listen(port, () => {
    console.log(`We're live on port ${port}!`);
  });