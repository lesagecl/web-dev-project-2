const express = require('express');
const service = express();
service.use(express.json());

const port = 5001;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});

// permissions
service.options('*', (request, response) => {
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.sendStatus(200);
});

// sql credentials & parsing
const fs = require('fs');
const mysql = require('mysql');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

function rowToMemory(row) {
  return {
    id: row.id,
    start_time: row.start_time,
    end_time: row.end_time,
    week_day: row.week_day,
    is_deleted: row.is_deleted
  };
}

/* SELECT ENDPOINTS */

// get schedule for the week
service.get('/schedule', (request, response) => {
  const query = 'SELECT * FROM schedule WHERE is_deleted = 0';
  connection.query(query, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a given day
service.get('/schedule/:week_day', (request, response) => {
  const parameter = [request.params.week_day];
  const query = 'SELECT * FROM schedule WHERE week_day = ? AND is_deleted = 0';
  connection.query(query, parameter, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a certain id
service.get('/schedule/:id', (request, response) => {
  const parameter = [parseInt(request.params.id)];
  const query = 'SELECT * FROM schedule WHERE id = ? AND is_deleted = 0';
  connection.query(query, parameter, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a certain id and day
service.get('/schedule/:id/:week_day', (request, response) => {
  const parameters = [
    parseInt(request.params.id),
    request.params.week_day
  ];
  const query = 'SELECT * FROM schedule WHERE id = ? AND week_day = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get access to report.html
service.get('/report.html', (request, response) => {
  response.sendFile('./report.html', {root: __dirname});
});

/* INSERT ENDPOINTS */

// create a new schedule entry
service.post('/schedule', (request, response) => {
  if (request.body.hasOwnProperty('id') &&
    request.body.hasOwnProperty('start_time') &&
    request.body.hasOwnProperty('end_time') &&
    request.body.hasOwnProperty('week_day')) {

    const parameters = [
      request.body.id,
      request.body.start_time,
      request.body.end_time,
      request.body.week_day,
    ];
    const query = 'INSERT INTO schedule(id, start_time, end_time, week_day) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });
  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

/* UPDATE ENDPOINTS */

// edit a specific user's schedule for a specific day
service.patch('/schedule/:id/:week_day', (request, response) => {
  const parameters = [
    request.body.id,
    request.body.start_time,
    request.body.end_time,
    request.body.week_day,
    parseInt(request.params.id),
    request.params.week_day
  ];

  const query = 'UPDATE schedule SET id = ?, start_time = ?, end_time = ?, week_day = ? WHERE id = ? AND week_day = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

/* DELETE ENDPOINTS */

// delete schedule record
service.delete('/schedule/:id/:week_day', (request, response) => {
  const parameters = [
    parseInt(request.params.id),
    request.params.week_day
  ];

  const query = 'UPDATE schedule SET is_deleted = 1 WHERE id = ? AND week_day = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});
